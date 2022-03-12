const CommentModel = require("../models/comment.model");
let Comment = CommentModel.Comment;

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()

      .populate("creator", "_id userName pic")
      .populate("LikedBy")
      .populate("DislikedBy");

    res.json({ comments });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const getCommentsforTutorial = async (req, res) => {
  try {
    const comments = await Comment.find({
      referenceTutorial: req.params.TutId,
    })
    .populate("creator", "_id userName pic");

    res.json({ comments });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const addComment = async (req, res) => {
  const { creator, content, referenceTutorial } = req.body;
  let comment;
  try {
    comment = await Comment.create({
      creator,
      content,
      referenceTutorial,
    });
  } catch (err) {
    console.log(err);
  }

  if (comment) {
    res.status(201).json(comment);
  }
};

module.exports = {
  addComment,
  getComments,
  getCommentsforTutorial,
};
