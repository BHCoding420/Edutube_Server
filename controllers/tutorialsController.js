const TutorialModel = require("../models/tutorial.model");
let Tutorial = TutorialModel.Tutorial;

const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find()

      .populate("creator", "_id userName pic")
      .populate("LikedBy")
      .populate("DislikedBy");

    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const getTutorial = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ _id: req.params.id })

      .populate("creator", "_id userName")
      .populate("LikedBy")
      .populate("DislikedBy");

    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const getTutorialsbyUser = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ creator: req.params.UserId })

      .populate("creator", "_id userName")
      .populate("LikedBy")
      .populate("DislikedBy");

    res.json({ tutorials });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
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

module.exports = {
  addTutorial,
  getTutorial,
  getTutorials,
  deleteTutorial,
  updateTutorial,
  getTutorialsbyUser,
};
