const Sequelize = require("sequelize");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dialect = process.env.DIALECT;
const _key = process.env.PRIVATE_KEY;
const expiration = process.env.JWT_EXPIRES_IN;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dialect,
  hooks: true
});

const User = require("../model/User")(sequelize);

function createUsers(req, res) {
  const body = req.body;
  const { role, userCode, firstname, lastname, email, password } = body;

  User.create({
    role: role,
    userCode: userCode,  
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password
  })
  .then((newUser) => {
    res.status(201).json({message:'success'});
    console.log('Successful User Creation.');
  })
  .catch((err)=>{
    console.log('Error caught in User.create! Sent to client.')
    console.log(err);
    res.json({err});//return error to client
  });

}

//LOGIN-------------------------------------------------------------------------------------------------------------------------------------------------------------
async function login(req,res){
  //console.log(req.body);
  const { email, password } = req.body;
  //console.log(`email is: ${JSON.stringify({email})} \n and password is ${JSON.stringify({password})}`)

  try {
    const user = await User.findOne({ where: { email } });
    //console.log(JSON.stringify("email: " + user.email));
    if (!user) return res.json({ message: 'user not found' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){ 
      console.group('There was a failed login attempt.')
      return res.json({ message: 'incorrect password' });
    }
    const token = jwt.sign(
      { 
        email : user.email,
        firstname : user.firstname,
        lastname : user.lastname,
        role : user.role,
        userCode : user.userCode 
      }, 
        `${_key}`, 
      { 
        expiresIn: expiration, 
      }
    );

    res.status(201).json({
      status: 'success',
      token,
      expiresIn: expiration
    });

    console.log('[login]: finished auth! (success)')
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkUserCode(req, res){
  const { userCode } = req.body;
  const lookFor = await User.findOne({ where: { userCode } });

  if(!lookFor) res.json({message:"goods"});
  else{
    console.log('[checkUserCode()]: userCode already exists.')
    res.json({message:"already-exists"});
  }
}

//CHANGE USER ACCOUNT CREDENTIALS
async function changeUserAccount(req,res){
  const { token, prevEmail, newEmail, newPassword, condition } = req.body;
  //console.log(req.body);
  const doTokenCheck = true;
  if(!token||/^\s*$/.test(token)){
    console.error('[changeUserAccount()]: Error - someone\'s passing a token but it doesn\'t even exist?! tf bruh');
    return res.status(401).json( { message: 'invalid token'} )
  }
  if(!!token && doTokenCheck){
    try{
      const decode = jwt.verify(token, _key);
      console.log('token valid', decode);
    }
    catch(err){
      console.error('Error decoding token: ' + err);
      return res.status(401).json({message: 'invalid token'});
    }
  }

  try{
    const email = prevEmail;
    const user = await User.findOne({ where: { email } });

    if(!user) return res.status(404).json( { message: 'user not found'} );

    if(newEmail===user.email) return res.json({message : 'old email cannot be new email'});

    const isPasswordSame = await bcrypt.compare(newPassword, user.password);
    if(isPasswordSame) return res.json({message : 'old password cannot be new password'});

    var model;
    var constraint;
    switch(condition){
      case 'keep-email':
        model = { 
          password : newPassword 
        };

        constraint = 
        {
          where: {
            email: prevEmail
          },
          attributes: ['password'],
          individualHooks: true
        };

        break;
      case 'keep-pass':
        model = { 
          email : newEmail 
        };

        constraint = 
        {
          where: {
            email: prevEmail
          },
          attributes: ['email'],
          individualHooks: false
        };
        break;
      case 'keep-none':
        model = { 
          email : newEmail, 
          password : newPassword 
        };

        constraint = 
        {
          where: {
            email: prevEmail
          },
          attributes: ['email','password'],
          individualHooks: true
        }
        break;
      default:
        console.error('[changeUserAccount]: invalid condition');
    }
    console.log(model)
    console.log('newPassword: \'' + newPassword + '\'');

    User.update( 
      model,
      constraint
    )
    .then(( update ) => {
      res.status(201).json({ message:'success' });
      console.log('update user settings: ' + update);
      console.log('Successful User Update.');
    })
    .catch((err)=>{
      console.error('Error caught in User.update!\n' + err);
      res.status(500).json({err});//return error to client
    });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function retrieveUsers(req, res){
  const { role } = req.body;

  console.log('role: ' + role);
  if(role==='all'){
    const patients = await User.findAll(
      { 
        where: { role:'patient'},
        attributes: ['userCode', 'email', 'firstname', 'lastname', 'createdAt', 'role']
      }
    );
    const doctors = await User.findAll(
      { 
        where: { role:'doctor'}, 
        attributes: ['userCode', 'email', 'firstname', 'lastname', 'createdAt', 'role']
      }
    );

    res.json({patients,doctors});
  }
  else if(role!='all'){
    const user = await User.findAll(
      { 
        where: { role },
        attributes: ['userCode', 'email', 'firstname', 'lastname', 'createdAt', 'role']
      }
    );

    return res.json(
      user
    );
  }
}

async function getByUserCode(req, res){
  const { userCode } = req.body;

  const user = await User.findOne(
    { 
      where: { userCode : userCode},
      attributes: ['userCode', 'email', 'firstname', 'lastname', 'createdAt', 'role']
    }
  );

  if(!user) return res.json({ message:'nonexistent' });
  
  res.json(user);
}


async function createTwoFactorAuth(req, res){
  const { userCode } = req.body
  
  const secret = speakeasy.generateSecret({ length: 20 });
  //console.log(secret);
  const otpAuthUrl = secret.otpauth_url;

  try{
    await User.update( 
      { 
        secret : secret.base32
      },
      {
        where: {
          userCode
        },
        attributes: ['secret']
      }
    ).then(()=>{
      console.log('stored new secret for user ' + userCode);
    });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }

  console.log(otpAuthUrl);

  qrcode.toDataURL(otpAuthUrl, (err, dataUrl) => {
    if (err) {
      res.status(500).send('Error generating QR code');
    } else {
      console.log('successfully stored and created secret! sending qrcode back to user')
      res.json({ secret: secret.base32, qrCode: dataUrl });
    }
  });
}

async function verifyTwoFactorAuth(req,res){
  const { token, userCode } = req.body;

  var userSecret = await User.findOne(
    { 
      where: { userCode : userCode },
      attributes: ['secret']
    }
  );
    
  if(!userSecret) return
  if(!userSecret.secret) return;
  
  // console.log(userSecret);
  userSecret = userSecret.secret;

  // console.log(typeof userSecret)
  // console.log('secret ' + userSecret);

  const verified = speakeasy.totp.verify({
    secret : userSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    console.log('Token is valid. User authenticated!')
    res.json({ message: 'token-valid'});
  } else {
    res.json({message:'token-invalid'});
  }
}

async function verifyTwoFactorAuthViaEmail(req,res){
  const { token, email } = req.body;

  var userSecret = await User.findOne(
    { 
      where: { email },
      attributes: ['secret']
    }
  );
  
  console.log(userSecret);
  userSecret = userSecret.secret;

  console.log(typeof userSecret)
  console.log('secret ' + userSecret);

  const verified = speakeasy.totp.verify({
    secret : userSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    console.log('Token is valid. User authenticated!')
    res.json({ message: 'token-valid'});
  } else {
    res.json({message:'token-invalid'});
  }
}

async function checkForSecret(req, res){
  const { email } = req.body

  var userSecret = await User.findOne(
    { 
      where: { email },
      attributes: ['secret']
    }
  );
    
  try{
    const isNull = userSecret.secret == null;
    if(!isNull) return res.json({message:'yes'});
  }
  catch(err){
    console.error(err);
  }
  

  return res.json({message:"no"});
}

async function tea(req,res){
  return res.status(418).json({message:'Yooooooo you like coffee too?? LESGOOOOOOOOOOOOOOOO RRAAAAAARGH!!!'});
}

// async function findAll(res) {
//   try {
//     const users = await User.findAll({
//     });
//     res.json(users.map((user) => user.toJSON()));
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

exports.tea = tea;

exports.createUsers = createUsers;
exports.login = login;
exports.checkUserCode = checkUserCode;
exports.changeUserAccount = changeUserAccount;
exports.retrieveUsers = retrieveUsers;
exports.getByUserCode = getByUserCode;
exports.createTwoFactorAuth = createTwoFactorAuth;
exports.verifyTwoFactorAuth = verifyTwoFactorAuth;
exports.changeUserAccount = changeUserAccount;
exports.checkForSecret = checkForSecret;
exports.verifyTwoFactorAuthViaEmail = verifyTwoFactorAuthViaEmail;
// exports.findAll = findAll;
// exports.findById = findById;
// exports.updatedUser = updatedUser;

