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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "isa_term_project",
  multipleStatements: true,
});

app.post("/walls/API/V1/post/id", (req, res) => {
  let post = req.body;
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

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
