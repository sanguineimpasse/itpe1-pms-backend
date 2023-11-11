const Sequelize = require("sequelize");
const sequelize = new Sequelize("tbl_test", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

const User = require("../model/User")(sequelize);
const Post = require("../model/Post")(sequelize);
const Comment = require("../model/Comment")(sequelize);

function createUsers(req, res) {
  const body = req.body;
  const { username, email } = body;
  try {
    User.create({
      username: username,
      email: email,
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
    //    const limit = parseInt(req.query.limit) || 5; // Set the desired limit, default to 5 if not provided
    const users = await User.findAll({
      //  limit: limit,
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

//POST CRUD
function createPost(req, res) {
  const body = req.body;
  const { title, content, userID } = body;
  try {
    Post.create({
      title: title,
      content: content,
      userID: userID,
    }).then((user) => {
      res.json({
        user: user.toJSON(),
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Failed to post the message!",
    });
  }
}

exports.createUsers = createUsers;
exports.findAll = findAll;
exports.findById = findById;
exports.updatedUser = updatedUser;
exports.createPost = createPost;
