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
let currentUser = {};

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
app.use(express.static(__dirname + "/static"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET",
    "PUT",
    "POST",
    "DELETE",
    "OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,Content-Length,X-Requested-With"
  );
  next();
});

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

app.get("/walls/API/V1/post/admin", (req, res) => {
  res.send(
    "Pinged post /walls/API/V1/postid ${pingCountId} times.\nPinged get /walls/API/V1/post ${pingCountPost} times."
  );
});

app.post("/walls/API/V1/post", (req, res) => {
  posts.wall_post_req++;
  //console.log(posts.wall_post_req);
  pingCountId++;
  let post = req.body;
  //console.log(post);
  let wallPostStmt = `INSERT INTO wall_posts (text,date,users_id) values ('${post.text}','${post.date}',${currentUser.id})`;
  db.query(wallPostStmt, function(err, result) {
    if (err) {
      console.log(
        ` Wall post ${post.text} could not be stored in the DB: ` + err.stack
      );
      res.sendStatus(400);
    }
    console.log(`Wall post ${post.text} was stored succesfully`);
    res.sendStatus(200);
  });
});

app.get("/walls/API/V1/post", (req, res) => {
  let postQuery = `SELECT * FROM wall_posts WHERE users_id = ${currentUser.id}`;
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

app.put("/walls/API/V1/post/:id", (req, res) => {
  let post = req.body;
  let putStmt = `UPDATE wall_posts SET text = '${post.text}' WHERE wall_post_id = ${req
    .params.id}`;
  db.query(putStmt, function(err, result, fields) {
    if (err) {
      console.log(`could not update wall post: ${post.text}: ` + err.stack);
      res.sendStatus(400);
    }
    console.log(`Updated wall post: ${post.text}`);
    res.sendStatus(200);
  });
});

app.delete("/walls/API/V1/post/:id", (req, res) => {
  let post = req.body;
  let deleteStmt = `DELETE FROM wall_posts WHERE wall_post_id = ${req
    .params.id}`;
  db.query(deleteStmt, function(err, result, fields) {
    if (err) {
      console.log(`could not delete wall post ${post.text}: ` + err.stack);
      res.sendStatus(400);
    }
    console.log(`Deleted wall post: ${post.text}`);
    res.sendStatus(200);
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
      "INSERT INTO users (username, password) VALUES (?, ?)",
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
          res.redirect("/");
        }
      }
    );
  }
});

app.post(rootPost + "/login", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  currentUser.username = username;
  currentUser.password = password;
  console.log(username, password);
  console.log(req.session.loggedin);
  if (username && password) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function(err, result, fields) {
        if (err) {
          res.send({
            code: 400,
            username: username,
            password: password,
            failed: err,
          });
        } else {
          currentUser.id = result[0].id;
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/wall");
        }
      }
    );
  }
});

app.get("/walls/API/V1/user/logout", (req, res) => {
  req.session.destroy(function(err){
    if(err) {
      console.log(err);
    } else {
      console.log('HEREEEEE');
      res.redirect('/');
    }
  });
  //res.redirect('/');
});

app.get("/walls/API/V1/admin/stats", (req, res) => {
  let string = JSON.stringify(posts);
  res.send(string);
});

/*
app.get("/walls/API/V1/post", (req, res) => {
  pingCountPost++;
  let postQuery = `SELECT * FROM wall_posts WHERE users_id = ${currentUser.id} `;
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
});*/

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
