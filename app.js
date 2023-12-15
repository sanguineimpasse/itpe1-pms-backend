const express = require("express");
const bodyParser = require("body-parser");
const { getRoutes } = require("./routes");

async function configureApp(pool) {
  console.log("Entering configuration");
  const app = express();
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

  app.set("db", pool);
  getRoutes(app);

  app.listen(3000, function () {
    console.log("Listening to port 3000");
  });
  console.log("Exiting configuration.");
  return app;
}

exports.configureApp = configureApp;
