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
  //console.log("testtt ", req.session.username, req.session.id, req.session);
  console.log(req.session.username);
  db.query('SELECT id FROM users WHERE username = ?', [req.session.username],
  function(err, result) {
    if(err) throw err;
    let id = JSON.parse(JSON.stringify(result[0]['id']));
    console.log(req.body.text, req.body.date, id);
    if(result.length > 0) {
      db.query('INSERT INTO wall_posts (text, date, users_id) VALUES (?, ?, ?)', [req.body.text, req.body.date, id],
      function(err, results, fields) {
        if(err) {
          console.log(err);
          res.send({
            code: 400,
            failed: err
          });
        }
      });
    }
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
        } else if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/wall");
        } else {
          res.redirect(404, '/');
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
  db.query('SELECT id FROM users WHERE username = ?', [req.session.username],
  function(err, result) {
    if(err) throw err;
    let id = JSON.parse(JSON.stringify(result[0]['id']));
    if(result.length > 0) {
      db.query('SELECT * FROM wall_posts WHERE users_id = ?', [id],
      function(err, result) {
        if(err) {
          res.sendStatus(400);
        }
        let query_obj = { results: [] };
        for(let i = 0; i < result.length; i++) {
          query_obj["results"].push(JSON.stringify(result[i]));
        }
        let convert_to_string = JSON.stringify(query_obj);
        res.send(convert_to_string);
      });
    }
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
