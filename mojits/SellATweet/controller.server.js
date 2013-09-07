/*global YUI*/
YUI.add('SellATweet', function(Y, NAME) {
    "use strict";

    Y.namespace('mojito.controllers')[NAME] = {

        index: function(ac) {
            var st = ac.session.get("status");
            if (!st) {
                ac.session.set("status", "saiprasad" + Date.now());
            }
             ac.done({
                status: ac.session.get("status")
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
        }
    };

}, '0.0.1', {requires: ['mojito', 'mojito-session-addon', 'mojito-http-addon', 'instamojo']});
