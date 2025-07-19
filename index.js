const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3013;
const Blog = require("./models/blog.model.js");
const blogRoutes = require("./routes/blog.route.js");

const path = require("path");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});


app.get("/", (req, res) => {
 res.render("Front");
});

app.get('/update-success', (req, res) => {
  const message = req.query.message || 'No message'; 
  res.render('update-success', { message: message }); 
});

app.use("/blogs", blogRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/blog_app");

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection successful...");
  app.listen(port, () => {
    console.log("Server is running on port http://localhost:3013");
  });
});





