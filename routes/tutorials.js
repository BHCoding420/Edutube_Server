const express = require("express");
const {
  addTutorial,
  getTutorials,
  deleteTutorial,
  updateTutorial,
  getTutorialsbyUser,
  getTutorial,
} = require("../controllers/tutorialsController");

const router = express.Router();

router.route("/").get(getTutorials);
router.route("/view/:id").get(getTutorial);
router.route("/:UserId").get(getTutorialsbyUser);
router.route("/").post(addTutorial);
router.route("/:id").delete(deleteTutorial);
router.route("/update/:id").patch(updateTutorial);

module.exports = router;
