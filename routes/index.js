const {
  createUser,
  findAllUsers,
  findUserID,
  updateUser
} = require("./crudRoutes");

function getRoutes(app) {
  app.post("/create/user", createUser);
  app.post("/findAll/users", findAllUsers);
  app.post("/find/user-id", findUserID);
  app.post("/update/user", updateUser);
}

exports.getRoutes = getRoutes;
