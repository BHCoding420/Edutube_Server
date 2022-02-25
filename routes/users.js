const express = require("express");
const {
  registerUser,
  getUsers,
  authUser,
  activateUser,
  deleteUser,
  sendmail,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.delete("/:id", deleteUser);
router.get("/activate/:userId", activateUser);
router.get("/:id/:address", sendmail);

module.exports = router;
