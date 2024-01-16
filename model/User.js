// models/User.js
const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

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
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        //console.log('before create: ' + user.password);
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        //console.log('before update: ' + user.password);
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  });

  return User;
};
