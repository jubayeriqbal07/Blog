"use strict";

// IMPORTINGS
var express = require('express');

var path = require('path');

var mongoose = require('mongoose');

var NodeCache = require('node-cache');

var cus_utils = require("./utils.js"); // const dbServer = "mongodb+srv://iqbaljubayer8:wpzkHKA64VUlI7mp@ventron.d0kxyl4.mongodb.net/BLOG";


var dbServer = "mongodb://localhost/BLOG";
var app = express();
var port = 8080;
mongoose.connect(dbServer).then(function (element) {
  console.log("Connetction Established!");
})["catch"](function () {
  console.log("Connetction Failed!");
});
var myCache = new NodeCache();
app.use('/static', express["static"](path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); // DATABASE COLLECTIONS

var postsSchema = new mongoose.Schema({
  usr_: String,
  title: String,
  desc: String
});
var POSTS = mongoose.model("posts", postsSchema);
var userSchecma = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String
});
var USER = mongoose.model('users', userSchecma); // ENDPOINTS

app.get('/', function (req, res) {
  POSTS.find().then(function (document) {
    document.forEach(function (element) {
      element.desc = cus_utils.short_dsc_pretify(element.desc);
    });
    params = {
      contents: document,
      isSignedIn: myCache.has('uniqueKey')
    };
    res.render('index', params);
  });
});

function load_contents() {
  POSTS.find().then(function (document) {
    document.forEach(function (element) {
      app.get("/posts/".concat(element._id), function (req, res) {
        desc_ = dsc_pretify(element.desc);
        params = {
          content: {
            title: element.title,
            usr_: element.usr_,
            desc: desc_
          },
          isSignedIn: myCache.has('uniqueKey')
        };
        res.render('posts', params);
      });
    });
  });
}

load_contents();
app.get("/createPost", function (req, res) {
  if (myCache.has('uniqueKey')) {
    res.render('createPost', params = {
      isSignedIn: myCache.has('uniqueKey')
    });
  } else {
    res.status(404);
    res.send("<h1>ERROR 404</h1>");
  }
});
app.post("/createPost", function (req, res) {
  post_usr = myCache.get('uniqueKey');
  post_title = req.body.post_title;
  post_desc = req.body.desc;
  POSTS.insertMany([{
    usr_: post_usr,
    title: post_title,
    desc: post_desc
  }]);
  load_contents();
  res.redirect('/');
});
app.get('/signIn', function (req, res) {
  res.render('signIn', params = {
    incorrect: false
  });
});
app.post('/signIn', function (req, res) {
  usr_found = false;
  usr_pass_corr = false;
  USER.find({
    email: req.body.usr_email
  }).then(function (element) {
    if (element.length > 0 && element[0].password == req.body.usr_pass) {
      myCache.set('uniqueKey', req.body.usr_email);
      res.redirect("/");
    } else {
      res.render('signIn', params = {
        incorrect: true
      });
    }
  });
});
app.get('/signUp', function (req, res) {
  res.render('signUp', params = {
    accExist: false
  });
});
app.post('/signUp', function (req, res) {
  usr_fullname = req.body.usr_fullname;
  usr_email = req.body.usr_email;
  usr_pass = req.body.usr_pass;
  USER.find({
    email: usr_email
  }).then(function (element) {
    if (element.length > 0) {
      res.render('signUp', params = {
        accExist: true
      });
    } else {
      USER.insertMany([{
        fullname: usr_fullname,
        email: usr_email,
        password: usr_pass
      }]);
      myCache.set('uniqueKey', usr_email);
      res.redirect('/');
    }
  });
});
app.get('/signOut', function (req, res) {
  if (myCache.has('uniqueKey')) {
    myCache.del('uniqueKey');
    res.redirect('/');
  } else {
    res.redirect('/');
  }
}); // START THE SERVER

app.listen(port, function () {
  console.log("This application is running on port: ".concat(port));
});