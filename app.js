const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");
const Mongoose = require("mongoose");

Mongoose.connect(
  "mongodb+srv://keshavgupta2:horseboy@cluster0.re0hdub.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const blogSchema = Mongoose.Schema({
  title: String,
  content: String,
});

const Article = Mongoose.model("Post", blogSchema);
const homeStartingContent =
  "Welcome to Daily Journal. Discover a world of captivating stories, insightful articles, and thought-provoking ideas on our engaging blog platform. We strive to provide a diverse range of content that will inspire, inform, and entertain you. Whether you're a passionate reader, a curious learner, or a seeker of inspiration, you've come to the right place.What makes us unique? We believe in the power of storytelling to connect people and foster meaningful conversations. Our team of talented writers and contributors pour their hearts and minds into crafting compelling narratives, exploring a wide array of topics spanning art, science, technology, culture, lifestyle, and more.Stay up to date with the latest trends, breakthroughs, and discoveries through our thoughtfully curated articles. Dive deep into our captivating stories that shine a light on extraordinary individuals, remarkable places, and awe-inspiring experiences from around the world. Delve into our well-researched pieces that provide valuable insights into diverse subjects, sparking new ideas and perspectives.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "public")));

let posts = [];

app.get("/", async function (req, res) {
  await Article.find({}).then((postss) => {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: postss,
    });
  });
});

app.get("/about", async function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", async function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", async function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody,
  // };
  const post = await new Article({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save().catch((err) => {
    console.log(err);
  });
  // posts.push(post);
  let length = 100;
  let trimmedStr = post.content;
  if (trimmedStr.length > length) {
    trimmedStr = post.content.substring(0, length - 3) + "...";
  } else trimmedStr = post.content;

  res.redirect("/");
});

app.get("/posts/:postID", async (req, res) => {
  // const postID = _.lowerCase(req.params.postID);
  const postID = req.params.postID;
  await Article.findOne({ _id: postID }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
