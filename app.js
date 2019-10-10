const express = require("express");
const port = 3000;
const app = express();

// 載入packages
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// 使用packages
// template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// flash message
app.use(flash());

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// method-override
app.use(methodOverride("_method"));

// route
app.get("/", (req, res) => {
  res.send("initial");
});

// start listen
app.listen(port, () => {
  console.log(`App is running on localhost:${port}`);
});
