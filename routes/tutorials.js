const express = require("express");
const {
  addTutorial,
  getTutorials,
  deleteTutorial,
  updateTutorial,
  getTutorialsbyUser,
  getTutorial,
  addLiketoTut,
  addDisliketoTut,
  removeLiketoTutorial,
  removeDisliketoTutorial,
} = require("../controllers/tutorialsController");

const router = express.Router();

router.route("/").get(getTutorials);
router.route("/view/:id").get(getTutorial);
router.route("/:UserId").get(getTutorialsbyUser);
router.route("/").post(addTutorial);
router.route("/:id").delete(deleteTutorial);
router.route("/update/:id").patch(updateTutorial);
router.route("/like/:TutId/:UserId").put(addLiketoTut);
router.route("/dislike/:TutId/:UserId").put(addDisliketoTut);
router.route("/rem_like/:TutId/:UserId").put(removeLiketoTutorial);
router.route("/rem_dislike/:TutId/:UserId").put(removeDisliketoTutorial);
/*router.route("/:lol/:hello").put(async (req, res) => {
  const { lol, hello } = req.params;
  res.status(200).send(lol + " " + hello);
});*/

module.exports = router;
