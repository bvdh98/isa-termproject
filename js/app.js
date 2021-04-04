const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 8888;
const app = express();
const endpointRoot = "/walls/API/V1/post/"
const mongoose = require('mongoose');

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

const sqldb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "isa_term_project",
  multipleStatements: true,
});

const db = require("../models");
db.mongoose.connect('mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Success connecting to MongoDB");
  initial();
}).catch(err => {
  console.error("Connection error", err);
  process.exit();
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
