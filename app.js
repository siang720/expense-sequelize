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

// handlebars register helper
const Handlebars = require("handlebars");
Handlebars.registerHelper("ifEquals", function(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper("formatDate", function(date) {
  return date.toISOString().slice(0, 10);
});
Handlebars.registerHelper("toString", function(amount) {
  return amount.toString();
});

// 載入session
app.use(
  session({
    secret: "your secret key",
    resave: "false",
    saveUninitialized: "false"
  })
);

// 使用passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  // 新增兩個 flash message 變數
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

// use routes
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/user"));
app.use("/records", require("./routes/record"));

// start listen
app.listen(port, () => {
  console.log(`App is running on localhost:${port}`);
});
