const Sequelize = require("sequelize");
require("dotenv").config();

async function connectToDB() {
  const sequelize = new Sequelize("tbl_test", "root", "123456", {
    host: "localhost",
    dialect: "mysql",
  });
  const User = require("../model/User")(sequelize);
  const Post = require("../model/Post")(sequelize);
  const Comment = require("../model/Comment")(sequelize);

  User.hasMany(Post, { foreignKey: "userID" }); // A user can have many posts
  Post.belongsTo(User, { foreignKey: "userID" }); // A post belongs to a user
  User.hasMany(Comment); // A user can have many comments
  Comment.belongsTo(User); //A comment belongs to a user
  Post.hasMany(Comment); // A post can have many comments
  Comment.belongsTo(Post); //A comment belongs to a Post

  await sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });

  await sequelize
    .sync({ force: false }) // Set force to true to drop and recreate tables on each sync
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((error) => {
      console.error("Error synchronizing database:", error);
    });
}

exports.connectToDB = connectToDB;
