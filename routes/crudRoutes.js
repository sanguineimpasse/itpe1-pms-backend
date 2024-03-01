const DBModel = require("../lib/DBModel");

function tea(req,res){
  DBModel.tea(req,res);
}

function createUser(req, res) {
  DBModel.createUsers(req, res);
}

function login(req,res){
  DBModel.login(req,res);
}

function checkUserCode(req,res){
  DBModel.checkUserCode(req,res);
}

function changeUserAccount(req, res){
  DBModel.changeUserAccount(req,res);
}

function retrieveUsers(req, res){
  DBModel.retrieveUsers(req,res);
}

function getByUserCode(req, res){
  DBModel.getByUserCode(req, res);
}

function createTwoFactorAuth(req,res){
  DBModel.createTwoFactorAuth(req,res);
}

function verifyTwoFactorAuth(req,res){
  DBModel.verifyTwoFactorAuth(req,res);
}

function checkForSecret(req,res){
  DBModel.checkForSecret(req,res);
}

function verifyTwoFactorAuthViaEmail(req,res){
  DBModel.verifyTwoFactorAuthViaEmail(req,res);
}
// function findAllUsers(req, res) {
//   DBModel.findAll(res);
// }

// function findUserID(req, res) {
//   DBModel.findById(req, res);
// }

// function updateUser(req, res) {
//   DBModel.updatedUser(req, res);
// }

exports.tea = tea;

exports.createUser = createUser;
exports.login = login;
exports.checkUserCode = checkUserCode;
exports.changeUserAccount = changeUserAccount;
exports.retrieveUsers = retrieveUsers;
exports.getByUserCode = getByUserCode;
exports.createTwoFactorAuth = createTwoFactorAuth;
exports.verifyTwoFactorAuth = verifyTwoFactorAuth;
exports.checkForSecret = checkForSecret;
exports.verifyTwoFactorAuthViaEmail = verifyTwoFactorAuthViaEmail;
// exports.findAllUsers = findAllUsers;
// exports.findUserID = findUserID;
// exports.updateUser = updateUser;
