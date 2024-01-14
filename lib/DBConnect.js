const Sequelize = require("sequelize");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

async function connectToDB() {
  const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
  });
  const User = require("../model/User")(sequelize);

//   User.hasMany(Post, { foreignKey: "userID" }); // A user can have many posts
//   Post.belongsTo(User, { foreignKey: "userID" }); // A post belongs to a user
//   User.hasMany(Comment); // A user can have many comments
//   Comment.belongsTo(User); //A comment belongs to a user
//   Post.hasMany(Comment); // A post can have many comments
//   Comment.belongsTo(Post); //A comment belongs to a Post

  await sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
      process.exit(1);
    });

  await sequelize
    .sync({ alter : false }) 
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((error) => {
      console.error("Error synchronizing database:", error);
    });
}

exports.connectToDB = connectToDB;
