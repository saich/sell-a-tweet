/*global YUI*/
YUI.add('SellATweet', function(Y, NAME) {
    "use strict";

    Y.namespace('mojito.controllers')[NAME] = {

        index: function(ac) {
            var loginerror = ac.session.get("loginerror");
            ac.session.set("loginerror", false);
             ac.done({
                loginerror: loginerror,
                needAuth: !ac.session.get("imtoken"),
                status: ac.session.get("status")
            });
        },

        login: function (ac) {
            var username = ac.params.getFromBody("username"),
                password = ac.params.getFromBody("password");

            var im = new Y.InstaMojo({
                authtoken: ac.session.get("imtoken")
            });

            im.auth(username, password, function (err, result) {
                if (result && result.success) {
                    // login success..
                    ac.session.set("imtoken", result.token);
                    ac.http.redirect("/", 303);
                } else {
                    // login failure..
                    ac.session.set("loginerror", true);
                    ac.http.redirect("/", 303);
                }
            });
        },

        logout: function (ac) {
            // destroy instamojo token
            var im = new Y.InstaMojo({
                authtoken: ac.session.get("imtoken")
            });
            im.deleteAuthToken(function () {
                // ignore error, since there could be no token at all..
                ac.session.destroy();
                ac.http.redirect("/", 303);
            });
        },

        create: function (ac) {
            var authtoken = ac.session.get("imtoken");
            if (!authtoken) {
                ac.http.redirect("/", 303); // Redirect to login page
            }

            var params = ac.params.getFromBody();
            var im = new Y.InstaMojo({
                authtoken: ac.session.get("imtoken")
            });

            im.createOffer(params, function (err, result) {
                if (result && result.success) {
                    ac.done(result.offer);
                } else {
                    ac.error(result);
                }
            });
        },

        tweets: function (ac) {
            var screenname = ac.params.getFromUrl("screenname");
            ac.models.get("TwitterModel").getTweets(screenname, function (err, tweets) {
                if (err) {
                    return ac.error(err);
                }
                ac.done(tweets, "json");
            });
        }
    };

}, '0.0.1', {requires: ['mojito',
    'mojito-session-addon', 'mojito-http-addon', 'mojito-params-addon', 'mojito-models-addon',
    'instamojo']});
