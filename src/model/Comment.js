// models/Comment.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comment = sequelize.define("tbl_comments", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Comment;
};
