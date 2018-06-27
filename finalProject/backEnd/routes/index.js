const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const DIR = '../resources';
const obj = require('../MusixApiKey.json');
const fs = require('fs');
const googleCreds = require('../credentials2.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');



// const corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200
//
// };

// app.use(cors({origin: 'http://localhost:4200'}));



let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

//MongoDB

//Import the mongoose module


//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/test';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;


//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('we are connected!')
});

const fileSchema = mongoose.Schema({
    path: String
},{collection: 'imageGet'});

const userGoogleSchema = mongoose.Schema({
    google: {
        id: String,
        token: String,
        name: String,
        email: String,
    }

},{collection: 'userGoogle'});

const User = mongoose.model('userGoogle', userGoogleSchema);



//




// API calls
async function getMusixAPI(){
    try{
        return await require('musicmatch')(obj);

    }catch
        (err){
        console.log(err);
    }

}



async function getMusic(inputString){
    try {
        let music = await getMusixAPI();
        let result =  await music.trackSearch({q_lyrics: inputString, page: 1, page_size: 1, s_track_rating: "desc"});
        console.log(result);
        return result
    }
    catch(err){
        console.log(err);
    }
}

async function getLyrics(trackId){
    try {
        let music = await getMusixAPI();
        let lyricsJSON = await music.trackLyrics({track_id: trackId});
        return lyricsJSON.message.body.lyrics.lyrics_body;
    }catch(err){
        console.log(err);
    }
}

async function modifyLyrics(lyrics,keyword){
    try{
        let splitArray = await lyrics.split("\n");
        let found = false;
        for (let i = 0; i < splitArray.length && !found; i++) {
            if (splitArray[i].includes(keyword)) {
                return splitArray[i];
            }
        }
        return ("None")


    }catch(err){
        console.log(err);
    }
}

async function getTracks(data){
    try{

        let getTrackList = data.message.body.track_list;
        return await Promise.all(getTrackList.map(element => {
            return {
                trackId: element.track.track_id,
                trackName: element.track.track_name,
                artistName: element.track.artist_name
            }
        }));


    }catch (err) {
        console.log(err);
    }
}

async function retrieveLyrics(data,inputString){
    try{

        return await Promise.all(data.map(async element => {
            let myLyrics = await getLyrics(element.trackId);
            let modifiedLyrics = await modifyLyrics(myLyrics,inputString);

            element.lyrics =  modifiedLyrics;
            return element;
        }));


    }catch(err){
        console.log(err);
    }
}

async function callMusixAPI(inputString){
    let music = await getMusic(inputString);

    let trackList = await getTracks(music);
    let lyricsList = await retrieveLyrics(trackList,inputString);

    let filteredList = await lyricsList.filter(function(value){
        return value.lyrics != 'None';
    });
    return filteredList;
}



async function getVisionAPIkey(){
    const Vision =  await require('@google-cloud/vision');
    return await new Vision.ImageAnnotatorClient({
        keyFilename: '../CS591A1MEAN-89a28590f32f.json'
    });
}

async function getList(results){
    const labels = await results[0].labelAnnotations;
    return  await Promise.all(labels.map(label => {
        return label.description;
    }))
}

async function callVisionAPI(path){
    const client = await getVisionAPIkey();
    const results = await client.labelDetection(path);
    return await getList(results);

}


async function getVisionMusic(path,fileId){
    const wordList = await callVisionAPI(path);
    console.log(wordList);
    const wordLyrics = await Promise.all(wordList.map(async word => {
        const data = await callMusixAPI(word);
        return {
            keyword: word,
            captions: data
        }

    }));
    return await { head: fileId, body: wordLyrics};
}

async function getFileFromMongo(id){
    return await imgModel.findById({_id: id});
}

router.post('/api/upload',upload.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        // Performs label detection on the image
        const newModel = imgModel();
        newModel.path = req.file.path;
        newModel.save(function (err, savedObject) {
            if(err){
                console.log(err);
                res.status(500).send();
            }else {

                getVisionMusic(savedObject.path, savedObject._id).then(x => {
                    res.send(x)
                })
            }
        });

    }
});

router.get('/get/:id',function(req, res, next) {
    const inputString = req.params.id;
    getFileFromMongo(inputString).then(file => {
        res.sendFile(path.resolve(file.path))
    })
    // res.sendFile(path.resolve('../resources/'+inputString));
});

async function deleteImg(id){
    const file = await getFileFromMongo(id);
    fs.unlinkSync(file.path, function(err) {
        if (err) return console.log(err);
        console.log('file in Storage deleted successfully')
    });

    imgModel.findOneAndRemove({_id: id},function (err, myString) {
        if (err) {
            console.log(err);
        }else {
            console.log('file in MongoDB deleted successfully!');
        }
    });


}

router.delete('/del/:id',function(req, res, next) {
    const inputString = req.params.id;
    deleteImg(inputString)
    // res.sendFile(path.resolve('../resources/'+inputString));
});

passport.serializeUser((user, done)=>{
    done(null,user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done)=>{
    User.findById(id).then((user) =>{
        done(null,user);
    })
});



//Google Credentials
passport.use(new GoogleStrategy({
        clientID: googleCreds.web.client_id,
        clientSecret: googleCreds.web.client_secret,
        callbackURL: googleCreds.web.redirect_uris[0],

    }
    ,(accessToken, refreshToken, profile, done) =>{
        console.log('passport callback function fired');
        console.log(profile);

        User.findOne({'google.id': profile.id}).then((currentUser)=> {
            if(currentUser){
                console.log('user is:', currentUser)
                done(null,currentUser)
            }
            else{

                new User({
                    'google.id' : profile.id,
                    'google.token' :accessToken,
                    'google.name' : profile.displayName,
                    'google.email' : profile.emails[0].value,
            }).save().then((newUser) => {
                    console.log('new user created', newUser);
                    done(null,newUser);
                }

            )}
                });




    }
));

//






router.get('/google/profile', isLoggedIn, function(req, res) {
    res.send('success')
});

router.get('/google',function(req, res) {

    res.send('login Fail');
});

router.get('/google/logout', function(req, res) {
    req.logout();
});
function isLoggedIn(req, res, next) {
    console.log("isloggined");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/google');
}

router.get('/auth/google', passport.authenticate('google',

    { scope : ['profile'] }));

// router.get('/auth/google/callback', passport.authenticate('google',
//     {   successRedirect: '/google/profile',
//         failureRedirect: '/google',
//         failureFlash: true,
//         successFlash: 'Welcome!'
//     }
// ));

router.get('/auth/google/callback',passport.authenticate('google'),(req,res) =>{
    res.send(req.user)
});

module.exports = router;