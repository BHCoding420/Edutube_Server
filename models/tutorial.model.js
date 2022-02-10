const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const tutorialSchema = new Schema(
  {
    title: {
      type: String,
      required: true,

      trim: true,
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    description: { type: String, required: true },

    tags: [String],

    LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    DislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    file: { type: String },
    file_type: { type: String },
    thumbnail: {
      type: String,
      default:
        "http://portalvalparaiso.info/wp-content/uploads/2016/08/default-video-thumbnail.jpg",
    },
    UploadedAt: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

exports.Tutorial = Tutorial;
