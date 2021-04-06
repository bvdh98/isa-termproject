const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 8888;

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

let posts = {};
posts.wall_post_req = 0;
posts.wall_get_req = 0;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "isa_term_project",
  multipleStatements: true,
});

app.post("/walls/API/V1/post/id", (req, res) => {
  posts.wall_post_req ++;
  console.log(posts.wall_post_req);
  let post = req.body;
  let wallPostStmt = `INSERT INTO wall (text,date) values ('${post.text}','${post.date}')`;
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

app.get("/walls/API/V1/post", (req, res) => {
  posts.wall_get_req ++;
  console.log(posts.wall_get_req);
  let postQuery = "SELECT * FROM wall";
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

app.get("/walls/API/V1/admin/stats", (req, res) => {
  let string = JSON.stringify(posts);
  res.send(string);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
