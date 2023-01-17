var express = require('express');
var router = express.Router();
/* GET home page. */

const dashboard = require("./dashboard");
router.use('/dashboard', dashboard);

router.get('/', function(req, res, next) {
  res.render('main');
});

module.exports = router;
