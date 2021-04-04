const config = require("db.config.js");
const db = require("../models");
const User = db.user;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if(err) {
      res.status(500).send({message: err});
      return;
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if(err) {
      res.status(500).send({message: err});
      return;
    }
    if(!user) {
      return res.status(404).send({message: "user not found"});
    }
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if(!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password"
      });
    }
    let token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400});
    res.status(200).send({
      id: user._id,
      username: user.username,
      accessToken: token
    });
  });
};
