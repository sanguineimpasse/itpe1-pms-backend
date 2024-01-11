const {
  createUser,
  findAllUsers,
  findUserID,
  updateUser,
  login
} = require("./crudRoutes");

function getRoutes(app) {
  app.post("/create/user", createUser);
  app.post("/login", login);

  // app.post("/findAll/users", findAllUsers);
  // app.post("/find/user-id", findUserID);
  // app.post("/update/user", updateUser);
}

exports.getRoutes = getRoutes;
