var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');

router.get('/', function (req, res, next) {
  
  var sqlQuery = `SELECT * FROM users WHERE user_email = ?`;
  var values = [req.session.email];

  db.query(sqlQuery, values, function (err, results, fields) {

    var prices =  helpers.prices(results[0]);

    res.render('index', {
      title: 'Ilmoittautuminen - Kirjautuminen',
      authorised: req.session.authorised,
      fname: req.session.fname,
      email: req.session.email,
      user: results[0],
      prices: prices 
    });
  });
});

module.exports = router;