//requiring modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

//twitter library
var Twitter = require('twitter');
//secret app keys
var secret = require('./secret.js');
//putting library and keys together
var client = new Twitter(secret);

//bringing in the markov chain
var markov = require('./markov.js');

//body parsing
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

///THE MEAT!!!!

app.get('/api/tweets/:user', function(req, res) {
    var username = req.params.user;
    if (!username) {
        res.send("No user by that name.");
        return;
    }
    var params = {
        screen_name: username,
        include_rts: false,
        count: 200,
        contributor_details: false,
        trim_user: true
    };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets = tweets.map(function(tweet) {
                return tweet.text;
            });
            for (var i = 0; i < tweets.length; i++) {
                markov.train(tweets[i]);
            }
            res.send(markov.generate(140));
            chain = {};
            return;
        } else {
            console.log(error);
            res.send("There was an error.");
            return;
        }
    });
});


app.get('/api/tweets/:user1/:user2', function(req, res) {
    var username1 = req.params1.user1;
    var username2 = req.params2.user2;
    if (!username1 || !username2) {
        res.send("No users by those names.");
        return;
    }
    if (username1 === username2) {
        res.send("Those are the same users!");
        return;
    }
    var params1 = {
        screen_name: username1,
        include_rts: false,
        count: 200,
        contributor_details: false,
        trim_user: true
    };
    var params2 = {
        screen_name: username2,
        include_rts: false,
        count: 200,
        contributor_details: false,
        trim_user: true
    };
    client.get('statuses/user_timeline', params1, function(error, tweets, response) {
        if (!error) {
            tweets = tweets.map(function(tweet) {
                return tweet.text;
            });
        }
        client.get('statuses/user_timeline', params2, function(error, tweets, response) {
            if (!error) {
                tweets += tweets.map(function(tweet) {
                    return tweet.text;
                });
                for (var i = 0; i < tweets.length; i++) {
                    markov.train(tweets[i]);
                }
                res.send(markov.generate(140));
            } else {
                console.log(error);
                res.send("There was an error.");
            }
        });
        chain = {};
    });
});

//public folder
app.use(express.static('public'));

//error handling
app.use(function(req, res) {
    res.status(404);
    res.send("404: File Not Found");
});
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500);
    res.send("500 Internal Server Error");
});

//server startup
app.listen(8008, function() {
    console.log("Server started at BOOB.");
});