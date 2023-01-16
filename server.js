const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
//app.use(cors());
app.use(cors({ origin: "https://edutube2.netlify.app" }));

require("dotenv").config();

const tutorialsRouter = require("./routes/tutorials");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(express.json());

const uri = process.env.URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port: ${port}`))
  )
  .catch((error) => console.log(error.message));

app.use("/tutorials", tutorialsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

app.get("/", (req, res) => {
  res.send("Server update again :)");
});
