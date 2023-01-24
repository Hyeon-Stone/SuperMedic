var express = require('express');
var router = express.Router();
/* GET home page. */

const dashboard = require("./dashboard");
const regpatient = require("./regPatient");

router.use('/dashboard', dashboard);
router.use('/regpatient', regpatient);


router.get('/', function(req, res, next) {
  res.render('main');
});

module.exports = router;
