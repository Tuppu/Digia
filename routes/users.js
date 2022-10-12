var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');
var errors = [];

router.get('/register', helpers.loginChecker, function (req, res, next) {

  res.render('register', {
    title: 'Ilmoittautuminen'
  });

});

router.post('/register', helpers.loginChecker, function (req, res, next) {

  if (!helpers.checkForm([req.body.email,req.body.tel, req.body.psw, req.body.pswrepeat, req.body.fname])) {
    errors.push('Täytä kaikki kentät!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Anna oikea sähköpostiosoite!');
    next();
    return;
  }

  if (!helpers.validateTelephone(req.body.tel)) {
    errors.push('Anna oikea puhelinnumero!');
    next();
    return;
  }

  if (req.body.psw !== req.body.pswrepeat) {
    errors.push('Salasanat eivät täsmää!');
    next();
    return;
  }

  var lodge = (req.body.lodge != null); 
  var food = (req.body.food != null); 
  var shower = (req.body.shower != null);

  var sqlQuery = `INSERT INTO users VALUES(NULL, ?, ?, SHA2(?, 512), ?, ?, ?, ?, ?)`;
  var values = [req.body.email, req.body.tel, req.body.psw, req.body.fname, req.body.duration, lodge, food, shower];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.affectedRows == 1) {
      res.redirect('/login');
      return;
    } else {
      errors.push(err.message);
      next();
    }

  });

});

router.post('/register', function (req, res, next) {

  res.statusCode = 401;

  res.render('register', {
    title: 'Rekisteröidy',
    messages: errors
  });

  errors = [];

});

router.get('/login', helpers.loginChecker, function (req, res, next) {

  res.render('login', {
    title: 'Kirjaudu sisään'
  });

});

router.post('/login', function (req, res, next) {

  if (!helpers.checkForm([req.body.email, req.body.psw])) {
    errors.push('Täytä kaikki kentät!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Anna oikea sähköpostiosoite!');
    next();
    return;
  }

  var sqlQuery = `SELECT * FROM users WHERE user_email = ? AND user_pass = SHA2(?, 512)`;
  var values = [req.body.email, req.body.psw];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.length == 1) {
      req.session.authorised = true;
      req.session.fname = results[0].user_fname
      req.session.email = results[0].user_email
      res.redirect('/');
      return;
    } else {
      errors.push('Käyttäjänimi ja salasana eivät ole oikein.');
      next();
    }

  });

});

router.post('/login', function (req, res, next) {

  res.statusCode = 401;

  res.render('login', {
    title: 'Login',
    messages: errors
  });

  errors = [];

});

router.get('/exit', function (req, res, next) {

  req.session.destroy(function (err) {
    res.redirect('/');
  });

});

module.exports = router;