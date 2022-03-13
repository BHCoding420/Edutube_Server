const UserModel = require("../models/user.model");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");

let User = UserModel.User;

const registeration_errors = (userName, email, password) => {
  let errors = { nameError: "", emailError: "", passwordError: "" };
  const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  if (userName.length < 6) {
    errors.nameError = " name should be more than 6 characters";
  }

  if (!regEmail.test(email)) {
    errors.emailError = "please enter a valid email";
  }
  if (!regPassword.test(password)) {
    errors.passwordError =
      "password should be between 6 to 20 characters and should contain at least one numeric digit, one uppercase and one lowercase letter";
  }

  return errors;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("followers").populate("following");

    res.json({ users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find({ _id: req.params.UserId });

    res.json({ users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const registerUser = async (req, res) => {
  let errors = { nameError: "", emailError: "", passwordError: "" };
  try {
    const { userName, email, password, pic } = req.body;

    if (!userName || !email || !password) {
      //return res.status(400).json({ error: "Please Enter all the Feilds" });
      throw new Error({ error: "Please Enter all the Feilds" });
    }

    const emailExists = await User.findOne({ email }).catch((err) => {
      console.log("error" + err);
    });

    if (emailExists) {
      console.log("check 2");
      //res.status(400).send({ error: "e-mail already used" });

      throw { emailError: "e-mail already used" };
    }
    const usernameExists = await User.findOne({ userName }).catch((err) => {
      console.log("error" + err);
    });

    if (usernameExists) {
      console.log("check 2");
      //res.status(400).send({ error: "e-mail already used" });

      throw { nameError: "username already used" };
    }

    errors = registeration_errors(userName, email, password);

    if (
      errors.nameError != "" ||
      errors.emailError != "" ||
      errors.passwordError != ""
    ) {
      console.log("validation errrrror");
      throw errors;
    }

    const user = await User.create({
      userName,
      email,
      password,
      pic,
      followers: [],
      following: [],
    });

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
      //res.status(400).send({ error: "User not found" });
      throw { error: "User not found" };
    }
  } catch (err) {
    res.status(400).send(err);
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
      return res
        .status(400)
        .send({ error: "User not activated", email: user.email });
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

const sendmail = async (req, res) => {
  let id = req.params.id;
  let address = req.params.address;
  console.log(id);
  console.log(address);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hello.test.980@gmail.com",
      pass: "Bashar2002",
    },
    tls: { rejectUnauthorized: false },
  });

  var mailOptions = {
    from: "hello.test.980@gmail.com",
    to: address,
    subject: "Sending Email using Node.js",
    text: `https://edutube-server.herokuapp.com/users/activate/${id}`,
  };

  let result_mail = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("sending fail");
      console.log(error);
      res.json({ success: false });
    } else {
      console.log("Email sent: " + info);
      res.json({ success: true });
    }
  });
  return;
};

const addFollower = async (req, res) => {
  const { followerId, UserId } = req.params;
  const addfollower = await User.findByIdAndUpdate(
    UserId,
    {
      $push: { followers: followerId },
    },
    {
      new: true,
    }
  );
  const addFollowing = await User.findByIdAndUpdate(
    followerId,
    {
      $push: { following: UserId },
    },
    {
      new: true,
    }
  );
  addFollower && addFollowing ? res.send("follow added") : res.send(error);
};

const removeFollower = async (req, res) => {
  const { followerId, UserId } = req.params;
  const removefollower = await User.findByIdAndUpdate(
    UserId,
    {
      $pull: { followers: followerId },
    },
    {
      new: true,
    }
  );
  const removeFollowing = await User.findByIdAndUpdate(
    followerId,
    {
      $pull: { following: UserId },
    },
    {
      new: true,
    }
  );
  removeFollower && removeFollowing
    ? res.send("follow added")
    : res.send(error);
};

module.exports = {
  registerUser,
  getUsers,
  getUser,
  authUser,
  activateUser,
  deleteUser,
  sendmail,
  addFollower,
  removeFollower,
};
