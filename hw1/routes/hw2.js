var express = require('express');
var router = express.Router();



//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/test';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('we are connected!')
});


const stringSchema = mongoose.Schema({
    string: String,
    length: Number
},{collection: 'strings'});

const stringModel = mongoose.model('strings', stringSchema);

/* GET home page. */
router.get('/:string', function(req, res, next) {
        const inputString = req.params.string;
        stringModel.find({string: inputString },
            function(err, myString){
            if(err){
                console.log(err);
            }
            if(myString.length == 0){
                console.log('object does not exists in database');
                const newString = stringModel();
                newString.string = inputString;
                newString.length = inputString.length;
                newString.save(function(err,savedObject){
                    if(err){
                        console.log(err);
                        res.status(500).send();
                    }
                    else{
                        res.send({string:savedObject.string, length:savedObject.length});
                        console.log('object saved successfully!');
                    }
                })
            }
            else{
                res.send({string: myString[0].string, length: myString[0].length});
                console.log('fetched successfully!');
            }

            });


});

router.get('/', function(req, res, next) {

    let query = stringModel.find({}).select('string -_id')
    query.exec(function (err, myStrings) {
        if (err) return next(err);
        res.send(myStrings);
    });

});

router.post('/', function(req, res) {
    const inputString = req.body.string;
    if(inputString.length == 0){

            res.send({message: 'Please provide a string!' });
        }

    else {

        stringModel.find({string: inputString},
        function (err, myString) {
            if (err) {
                console.log(err);
            }
            if (myString.length == 0) {
                console.log('object does not exists in database');
                const newString = stringModel();
                newString.string = inputString;
                newString.length = inputString.length;
                newString.save(function (err, savedObject) {
                    if (err) {
                        console.log(err);
                        res.status(500).send();
                    }
                    else {
                        res.send({string: savedObject.string, length: savedObject.length});
                        console.log('object saved successfully!');
                    }
                })
            }
            else {
                res.send({string: myString[0].string, length: myString[0].length});
                console.log('fetched successfully!');
            }

        });
}
});

router.delete('/:string', function(req, res) {
    const inputString = req.params.string;
    stringModel.findOneAndRemove({string: inputString},
        function (err, myString) {
            if (err) {
                console.log(err);
            }
            if (myString == null) {
                console.log('object does not exists in database');
                res.send({message: 'string not found'})
            }
            else {
                        console.log('string deleted successfully!');
                        res.send({message: 'string deleted successfully'});
                }
        })
})


module.exports = router;
