const express = require("express");
const {
  registerUser,
  getUsers,
  authUser,
  activateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.delete("/:id", deleteUser);
router.get("/activate/:userId", activateUser);

module.exports = router;
