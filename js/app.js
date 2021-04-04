const mysql = require("mysql");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 8888;
const app = express();
const endpointRoot = "/walls";
const rootPost = "/walls/API/V1/post";
const mongoose = require('mongoose');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "nodelogin",
  multipleStatements: true,
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../login.html'));
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname + '/../signup.html'));
});

app.get('/wall', function(req, res) {
  if(req.session.loggedin) {
    res.sendFile(path.join(__dirname + '/../wall.html'));
  } else {
    res.send("Please login to view this page");
  }
  res.end();
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname + '/../admin.html'));
});

app.post(rootPost + "/signup", function(req, res) {
  let username = req.username; //req.body.username;
  let password = req.password; //req.body.password;
  if(username && password) {
    connection.query("INSERT INTO users(username, password) VALUES ?", [username, password],
    function(err, results, fields) {
      if(err) {
        res.send({
          "code": 400,
          "failed": "error occured"
        })
      } else {
        res.send({
          "code": 200,
          "success": "user registered successfully"
        });
        res.redirect("/login");
      }
    });
  }
});

app.post(rootPost + "/login", function(req, res) {
  let username = req.username; //req.body.username;
  let password = req.password; //req.body.password;
  if(username && password) {
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password], function(err, results, fields) {
      if(results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect("/wall");
      } else {
        res.send("Please enter a valid username and password!");
        res.end();
      }
    });
  }
});

app.get("/walls/API/V1/post", (req, res) => {
  let postQuery =
    "SELECT * FROM wall_posts";
  let string = "";
  sqldb.query(postQuery, function(err, result, fields) {
    if (err) {
      console.log(`could not get wall posts: ` + err.stack);
      res.sendStatus(400);
    }
    console.log(`Got all wall posts`);
    let query_obj = { results: [] };
    for (let i = 0; i < result.length; i++) {
      query_obj["results"].push(JSON.stringify(result[i]));
    }
    console.log(query_obj.results);
    string = JSON.stringify(query_obj);
    res.send(string);
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
