var express = require('express');
var router = express.Router();


router.post('/', function(req, res) {
        let id = req.body.string;
        res.send({string:id, length: id.length})
});

module.exports = router;
