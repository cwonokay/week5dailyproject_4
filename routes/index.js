const express  = require("express");
const router   = express.Router();

let user = { username: "cornelia", password: "keyskeys"};
router.get("/", function(req, res) {
  res.render("login");
});


router.post("/", function(req, res) {
   req.checkBody("username", "username cannot be empty.").notEmpty();
   req.checkBody("username", "Cannot exceed 25 char").isLength({max:25});
   req.checkBody("username", "Cannot have special ").isAlphanumeric();
   req.checkBody("username", "Cannot exceed 8 char").isLength({min:8});
   req.checkBody("password", "password cannot be empty.").notEmpty();
   req.checkBody("password", "Must be at least 8 chars .").isLength({min:8});
  let errors = req.getValidationResult();
  let messages = [];
 errors.then(function(result) {
    result.array().forEach(function(error) {
      messages.push(error.msg);
    });
    let obj = {
      errors: messages,
      username: req.body.username,
      password: req.body.password,
    };

    res.render('results', obj);
    });
  });


  function authenticate(req, res, next) {
    if (req.session.token) {
      res.redirect("/results");
    } else {
      console.log("No token");
      next();
    }
};


  router.get("/", authenticate, function(req, res) {
    res.render("login");
  });

  router.get("/results", function(req, res, next) {
    if (req.session.token) {
      next();
    } else {
      res.redirect("/")
    }
  }, function(req, res) {
    res.render("results", req.session.user);
  });

  router.post("/results", function(req, res) {
    let obj = {
      username: req.body.username,
      password: req.body.password
    };

    if (obj.username == user.username && obj.password == user.password) {
      req.session.user = obj;
      req.session.token = "afs29628";
      res.redirect("/results");
    } else {
      res.redirect("/");
    }
  });

  router.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      console.log(err);
    });

    res.redirect("/");
  });





  module.exports = router
