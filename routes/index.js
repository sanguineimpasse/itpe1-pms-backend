const {
  createUser,
  checkUserCode,
  login
} = require("./crudRoutes");

function getRoutes(app) {
  app.post("/create/user", createUser);
  app.post("/login", login);
  app.post("/verify/usercode", checkUserCode);

  app.get('*', function(req, res){
    res.status(404).send('incorrect route');
    unknownRoute();

  });
  app.post('*', function(req, res){
    res.status(404).send('incorrect route');
    unknownRoute();
  });
}

function unknownRoute(){
  console.log('A client tried to access a non-existent route');
}

exports.getRoutes = getRoutes;
