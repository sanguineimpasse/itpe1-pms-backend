// models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("tbl_users", {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return User;
};
