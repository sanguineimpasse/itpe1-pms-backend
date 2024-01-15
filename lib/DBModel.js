const Sequelize = require("sequelize");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dialect = process.env.DIALECT;
const key = process.env.RSA_PRIVATE_KEY;
const expiration = process.env.JWT_EXPIRES_IN;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dialect,
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
    console.log('Successfull User Creation.');
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
    if (!isPasswordValid) return res.json({ message: 'incorrect password' });

    const token = jwt.sign(
      { 
        email : user.email,
        role : user.role 
      }, 
        `${key}`, 
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

// async function findById(req, res) {
//   console.log("ID:", req.body.id);
//   const id = req.body.id;
//   User.findByPk(id)
//     .then((user) => {
//       if (user) {
//         res.json(user.toJSON());
//       } else {
//         res.status(500).json({
//           error: "Not found",
//         });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         error: error,
//       });
//     });
// }

// function updatedUser(req, res) {
//   const body = req.body;
//   const { id, username, email } = body;
//   User.update(
//     { username, email },
//     {
//       where: {
//         userID: id,
//       },
//     }
//   )
//     .then(([rowsUpdated]) => {
//       if (rowsUpdated > 0) {
//         res.json({
//           result: body,
//         });
//       } else {
//         res.status(500).json({
//           error: "Failed to update, user not found",
//         });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         error: error,
//       });
//     });
// }

exports.createUsers = createUsers;
exports.login = login;
exports.checkUserCode = checkUserCode;
// exports.findAll = findAll;
// exports.findById = findById;
// exports.updatedUser = updatedUser;

