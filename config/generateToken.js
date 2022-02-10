const jwt = require("jsonwebtoken");

const generateToken = (id, username, pic) => {
  return jwt.sign({ id, username, pic }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
