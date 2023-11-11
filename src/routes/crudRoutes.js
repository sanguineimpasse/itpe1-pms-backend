const DBModel = require("../lib/DBModel");

function createUser(req, res) {
  DBModel.createUsers(req, res);
}

function findAllUsers(req, res) {
  DBModel.findAll(res);
}

function findUserID(req, res) {
  DBModel.findById(req, res);
}

function updateUser(req, res) {
  DBModel.updatedUser(req, res);
}

function addPost(req, res) {
  DBModel.createPost(req, res);
}

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserID = findUserID;
exports.updateUser = updateUser;
exports.addPost = addPost;
