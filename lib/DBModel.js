const Sequelize = require("sequelize");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
});

const User = require("../model/User")(sequelize);

function createUsers(req, res) {
  const body = req.body;
  const { role, firstname, lastname, email, password } = body;
  try {
    User.create({
      role: role,  
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    }).then((newUser) => {
      res.json({
        user: newUser.toJSON(),
      });
    });
  } catch (error) {
    res.json({
      message: "error",
    });
  }
}

async function findAll(res) {
  try {
    const users = await User.findAll({
    });
    res.json(users.map((user) => user.toJSON()));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function findById(req, res) {
  console.log("ID:", req.body.id);
  const id = req.body.id;
  User.findByPk(id)
    .then((user) => {
      if (user) {
        res.json(user.toJSON());
      } else {
        res.status(500).json({
          error: "Not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function updatedUser(req, res) {
  const body = req.body;
  const { id, username, email } = body;
  User.update(
    { username, email },
    {
      where: {
        userID: id,
      },
    }
  )
    .then(([rowsUpdated]) => {
      if (rowsUpdated > 0) {
        res.json({
          result: body,
        });
      } else {
        res.status(500).json({
          error: "Failed to update, user not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

exports.createUsers = createUsers;
exports.findAll = findAll;
exports.findById = findById;
exports.updatedUser = updatedUser;

