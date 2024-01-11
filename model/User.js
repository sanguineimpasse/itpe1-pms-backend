// models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("tbl_users", {
	userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
	},
	role:{
    type: DataTypes.STRING(32),
    allowNull: false
	},
  userCode:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
	firstname: {
    type: DataTypes.STRING,
    allowNull: true,
	},
  lastname:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  }
  });

  return User;
};
