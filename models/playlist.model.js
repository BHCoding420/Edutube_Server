const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,

      trim: true,
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    description: { type: String },

    files: [String],

    UploadedAt: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

exports.Playlist = Playlist;
