const express = require("express");
const {
  addComment,
  getComments,
  getCommentsforTutorial,
} = require("../controllers/commentsController");

const router = express.Router();

router.route("/").get(getComments);
router.route("/:TutId").get(getCommentsforTutorial);
router.route("/").post(addComment);

module.exports = router;
