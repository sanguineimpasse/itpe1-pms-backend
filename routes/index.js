const {
  createUser,
  checkUserCode,
  login,
  changeUserAccount,
  retrieveUsers,
  getByUserCode,
  createTwoFactorAuth,
  verifyTwoFactorAuth,
  checkForSecret,
  verifyTwoFactorAuthViaEmail,
  tea
} = require("./crudRoutes");

function getRoutes(app) {
  app.post("/create/user", createUser);
  app.post("/login", login);
  app.post("/verify/usercode", checkUserCode);
  app.patch("/patch/useraccount", changeUserAccount);
  app.post("/retrieve/users", retrieveUsers);
  app.post("/retrieve/by-user-code", getByUserCode);
  app.post("/create/2fa", createTwoFactorAuth);
  app.post("/verify/2fa", verifyTwoFactorAuth);
  app.post("/verify/secret", checkForSecret);
  app.post("/verify/2fa/email", verifyTwoFactorAuthViaEmail);
  app.get("/brew",tea);

  app.get('*', function(req, res){
    res.status(404).send('incorrect route');
    unknownRoute();
  });
  app.post('*', function(req, res){
    res.status(404).send('incorrect route');
    unknownRoute();
  });
  app.patch('*', function(req, res){
    res.status(404).send('incorrect route');
    unknownRoute();
  });
}

function unknownRoute(){
  console.log('A client tried to access a non-existent route');
}

exports.getRoutes = getRoutes;
