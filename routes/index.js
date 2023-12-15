const {
  createUser,
  findAllUsers,
  findUserID,
  updateUser,
  addPost,
  getPostByUser,
} = require("./crudRoutes");

function getRoutes(app) {
  // app.get("/check/:params", check);
  // app.post("/post", postMessage);
  app.post("/create/user", createUser);
  app.post("/findAll/users", findAllUsers);
  app.post("/find/user-id", findUserID);
  app.post("/update/user", updateUser);

  //Post routes
  app.post("/post/add", addPost);
}

exports.getRoutes = getRoutes;
