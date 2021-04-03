let http = require("http");

let mysql = require("mysql");

let express = require("express");

let app = express();

let path = require("path");

let endpointRoot = "/postit";

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("test");
}).listen(8000);

/*
let con = mysql.createConnection({
  host: "localhost",
  user: "choi_bimmer",
  password: "rootroot",
  database: "users"
});
*/

/*
con.connect(function(err) {
  if(err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM Users", function(err, result, fields) {
    if(err) throw err;
    console.log(result);
  });
});*/

app.get(endpointRoot, )
