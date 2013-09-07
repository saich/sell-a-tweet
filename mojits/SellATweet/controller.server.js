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
        }
    };

}, '0.0.1', {requires: ['mojito', 'mojito-session-addon']});
