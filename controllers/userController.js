const UserModel = require("../models/user.model");
const generateToken = require("../config/generateToken");

let User = UserModel.User;

const registeration_errors = () => {};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json({ users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const registerUser = async (req, res) => {
  const { userName, email, password, pic } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ error: "Please Enter all the Feilds" });
    //throw new Error("Please Enter all the Feilds");
  }
  console.log("check 1");
  const userExists = await User.findOne({ email }).catch((err) => {
    console.log("error" + err);
  });

  if (userExists) {
    console.log("check 2");
    return res.status(400).send({ error: "e-mail already used" });

    //throw new Error("User already exists");
  }

  const user = await User.create({
    userName,
    email,
    password,
    pic,
    followers: [],
    following: [],
  });
  console.log("check 3");

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user.userName),
    });
  } else {
    res.status(400).send({ error: "User not found" });
    throw new Error("User not found");
  }
};

const activateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = { isActivated: true };
    const options = { new: true };
    const result = await User.findByIdAndUpdate(userId, updates, options);
    res.send(result);
  } catch (err) {
    console.error(err);
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ error: "wrong e-mail" });
  }

  if (user && (await user.matchPassword(password))) {
    if (user.isActivated == true) {
      res.json({
        token: generateToken(user._id, user.userName, user.pic),
      });
    } else {
      return res.status(400).send({ error: "User not activated" });
    }
  } else {
    res.status(401);
    return res.status(400).send({ error: "incorrect password" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
      .then(() => res.json("deleted user"))
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { registerUser, getUsers, authUser, activateUser, deleteUser };
