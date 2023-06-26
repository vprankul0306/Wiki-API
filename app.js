const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const articles = mongoose.model("articles", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    articles
      .find()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const newArticle = new articles({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(res.send("Successfully added a new article"))
      .catch((err) => {
        if (err) {
          res.send(err);
        }
      });
  })
  .delete((req, res) => {
    articles
      .deleteMany()
      .then(res.send("Successfully deleted all articles"))
      .catch((err) => {
        res.send(err);
      });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    articles
      .findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article found");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    articles
      .deleteOne({ title: req.params.articleTitle })
      .then(res.send("Successfully deleted the article"))
      .catch((err) => res.send(err));
  })
  .put((req, res) => {
    articles
      .updateOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content }
      )
      .then(res.send("Successfully updated the article"))
      .catch((err) => res.send(err));
  })

  .patch((req, res) => {
    articles
      .updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(res.send("Successfully updated the article"))
      .catch((err) => {
        res.send(err);
      });
  });

app.listen("3000", (req, res) => {
  console.log("Server started on port 3000");
});
