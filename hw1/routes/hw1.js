var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.send({string:req.params.id, length:req.params.id.length})
});

router.post('/', function(req, res) {
    let id = req.body.string;
    res.send({string:id, length: id.length})
});


module.exports = router;
