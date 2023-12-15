const { configureApp } = require("./app");
const { getParams } = require("./lib/DBParams");
const { connectToDB } = require("./lib/DBConnect");

let pool;
let params;

if (!params) {
  console.log("Fetching DB params");
  params = getParams();
}

if (!pool) {
  console.log("Initializing DB");
  pool = connectToDB(params);
}
configureApp(pool);
