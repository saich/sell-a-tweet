/*global YUI*/
YUI.add("TwitterModel", function (Y, NAME) {
    "use strict";

    var Twitter = require("ntwitter"),
        config = require("config");

    var twitter = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
    });

    Y.mojito.models[NAME] = {
        getTweets: function (screenName, callback) {
            twitter.get("/statuses/user_timeline.json", {screen_name: screenName}, function (err, results) {
                if (err) {
                    return callback(err, null);
                }
                var tweets = [];
                results.forEach(function (result) {
                    // TODO: Filter out retweets?
                    tweets.push(result.text);
                });
                callback(null, tweets);
            });
        }
    };
});