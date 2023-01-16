const TutorialModel = require("../models/tutorial.model");
let Tutorial = TutorialModel.Tutorial;
const mongoose = require("mongoose");

const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().populate(
      "creator",
      "_id userName pic"
    );

    res.header(
      "Access-Control-Allow-Origin",
      "https://edutubeserver-production.up.railway.app/"
    );
    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const getTutorial = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ _id: req.params.id })

      .populate("creator", "_id userName pic")
      .populate("comments");

    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const getTutorialsbyUser = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ creator: req.params.UserId })

      .populate("creator", "_id userName pic")
      .populate("LikedBy")
      .populate("DislikedBy");

    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const searchTutorials = async (req, res) => {
  const search_query = req.params.search_query;

  const result = await Tutorial.find({
    title: { $regex: `${search_query}`, $options: "si" },
  }).populate("creator");

  res.json({ result });
};

const addTutorial = async (req, res) => {
  const { title, creator, description, tags, file, file_type, thumbnail } =
    req.body;
  let tutorial;
  try {
    tutorial = await Tutorial.create({
      title,
      creator,
      description,
      tags,
      file,
      file_type,
      thumbnail,
      LikedBy: [],
      DislikedBy: [],
    });
  } catch (err) {
    console.log(err);
  }

  if (tutorial) {
    res.status(201).json(tutorial);
  }
};

const deleteTutorial = async (req, res) => {
  try {
    await Tutorial.findByIdAndDelete(req.params.id)
      .then(() => res.json("tut deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (error) {
    console.log(error.message);
  }
};

const updateTutorial = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const result = await Tutorial.findByIdAndUpdate(id, updates, options);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
};

const addLiketoTut = async (req, res) => {
  const { TutId, UserId } = req.params;

  const isDisliked = await Tutorial.find({
    _id: TutId,
    DislikedBy: { $in: [mongoose.Types.ObjectId(UserId)] },
  });
  console.log(isDisliked);
  console.log("alles gut");
  if (isDisliked) {
    const added = await Tutorial.findByIdAndUpdate(
      TutId,
      {
        $pull: { DislikedBy: UserId },
      },
      {
        new: true,
      }
    );
  }

  const added = await Tutorial.findByIdAndUpdate(
    TutId,
    {
      $push: { LikedBy: UserId },
    },
    {
      new: true,
    }
  );
  added ? res.send("added") : res.send(error);
};

const addDisliketoTut = async (req, res) => {
  const { TutId, UserId } = req.params;
  const isLiked = await Tutorial.find({
    _id: TutId,
    LikedBy: { $in: [mongoose.Types.ObjectId(UserId)] },
  });
  console.log(isLiked);
  console.log("alles gut");
  if (isLiked) {
    const added = await Tutorial.findByIdAndUpdate(
      TutId,
      {
        $pull: { LikedBy: UserId },
      },
      {
        new: true,
      }
    );
  }

  const added = await Tutorial.findByIdAndUpdate(
    TutId,
    {
      $push: { DislikedBy: UserId },
    },
    {
      new: true,
    }
  );
  added ? res.send("added") : res.send(error);
};
const removeLiketoTutorial = async (req, res) => {
  const { TutId, UserId } = req.params;
  const removed = await Tutorial.findByIdAndUpdate(
    TutId,
    {
      $pull: { LikedBy: UserId },
    },
    {
      new: true,
    }
  );
  removed ? res.send("removed") : res.send(error);
};
const removeDisliketoTutorial = async (req, res) => {
  const { TutId, UserId } = req.params;
  const removed = await Tutorial.findByIdAndUpdate(
    TutId,
    {
      $pull: { DislikedBy: UserId },
    },
    {
      new: true,
    }
  );
  removed ? res.send("removed") : res.send(error);
};

module.exports = {
  addTutorial,
  getTutorial,
  getTutorials,
  deleteTutorial,
  updateTutorial,
  getTutorialsbyUser,
  addLiketoTut,
  addDisliketoTut,
  removeLiketoTutorial,
  removeDisliketoTutorial,
  searchTutorials,
};
