const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const commentSchema = new Schema(
  {
    referenceTutorial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutorial",
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    content: { type: String, required: true },

    UploadedAt: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
