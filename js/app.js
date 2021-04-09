const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 8888;
const app = express();
const endpointRoot = "/walls";
const rootPost = "/walls/API/V1/post";

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(express.static(__dirname + '/static'));

let posts = {};
posts.wall_post_req = 0;
posts.wall_get_req = 0;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "nodelogin",
  multipleStatements: true,
});

let pingCountId = 0;
let pingCountPost = 0;

app.get('/walls/API/V1/post/admin', (req, res) => {
  res.send("Pinged post /walls/API/V1/postid ${pingCountId} times.\nPinged get /walls/API/V1/post ${pingCountPost} times.");
})

app.post("/walls/API/V1/post/id", (req, res) => {
  posts.wall_post_req ++;
  console.log(posts.wall_post_req);
  pingCountId++;
  let post = req.body;
  console.log(post);
  let wallPostStmt = `INSERT INTO wall_posts (text,date) values ('${post.text}','${post.date}')`;
  db.query(wallPostStmt, function(err, result) {
    if (err) {
      console.log(
        ` Wall post ${post.text} could not be stored in the DB: ` + err.stack
      );
      res.sendStatus(400);
    }
    console.log(`Wall post ${post.text} was stored succesfully`);
  });
});


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../login.html"));
});

app.get("/signup", function(req, res) {
  res.sendFile(path.join(__dirname + "/../signup.html"));
});

app.get("/wall", function(req, res) {
  console.log("here ", req.session.loggedin);
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname + "/../wall.html"));
  } else {
    res.send("Please login to view this page");
  }
  //res.end();
});

app.get("/admin", function(req, res) {
  res.sendFile(path.join(__dirname + "/../admin.html"));
});

app.post("/walls/API/V1/post/signup", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let values = [username, password];
  console.log(username, password);
  console.log(typeof username, typeof password);
  if (username && password) {
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)", [username, password],
      function(err, results, fields) {
        if (err) {
          res.send({
            code: 400,
            username: username,
            password: password,
            failed: err,
          });
        } else {
          res.redirect("/");
        }
      }
    );
  }
});

app.post(rootPost + "/login", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password);
  console.log(req.session.loggedin);
  if (username && password) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function(err, results, fields) {
        if (err) {
          res.send({
            code: 400,
            username: username,
            password: password,
            failed: err,
          });
        } else {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/wall");
        }
      }
    );
  }
});

app.get("/walls/API/V1/admin/stats", (req, res) => {
  let string = JSON.stringify(posts);
  res.send(string);
});

app.get("/walls/API/V1/post", (req, res) => {
  pingCountPost++;
  let postQuery =
    "SELECT * FROM wall";
  let string = "";
  db.query(postQuery, function(err, result, fields) {
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
