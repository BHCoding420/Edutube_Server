const express = require("express");
const {
  registerUser,
  getUsers,
  authUser,
  activateUser,
  deleteUser,
  sendmail,
  getUser,
  addFollower,
  removeFollower,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:UserId").get(getUser);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.delete("/:id", deleteUser);
router.get("/activate/:userId", activateUser);
router.get("/:id/:address", sendmail);
router.route("/follow/:followerId/:UserId").put(addFollower);
router.put("/unfollow/:followerId/:UserId", removeFollower);

module.exports = router;
