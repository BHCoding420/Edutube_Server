const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const nodemailer = require("nodemailer"); //
/*const transporter = nodemailer.createTransport({
  server: "hotmail",
  auth: {
    user: "bhcoding69@gmail.com",
    pass: "123456",
  },
});

const sendMail = (email) => {
  const options = {
    from: "noreply@gmail.com",
    to: "basharhamade99@gmail.com",
    subject: "VERIFY",
    text: "it works",
  };
  console.log("1");
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log("2");
      console.log(err);
      return;
    }
    console.log("3");
    console.log(email);
    console.log(info.response);
  });
};*/

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      trim: true,
    },
    email: { type: String, required: true, unique: true, trim: true },

    password: {
      type: String,
      required: true,
      trim: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isActivated: { type: "boolean", default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.post("save", async function (next) {
  console.log("post saving here");
  console.log(this.email);
  console.log(this._id);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bhcoding69@gmail.com",
      pass: "Bashar2002",
    },
    tls: { rejectUnauthorized: false },
  });

  var mailOptions = {
    from: "bhcoding69@gmail.com",
    to: this.email,
    subject: "Sending Email using Node.js",
    text: `http://localhost:5000/users/activate/${this._id}`,
  };

  let result_mail = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info);
    }
  });

  console.log(result_mail);
});

const User = mongoose.model("User", userSchema);

exports.User = User;
