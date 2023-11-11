// models/Post.js
const { DataTypes } = require("sequelize");
const User = require("./User");

module.exports = (sequelize) => {
  const Post = sequelize.define("tbl_posts", {
    postID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_users", // Name of the target table
        key: "userID", // Name of the target column
      },
    },
  });

  return Post;
};
