/*global YUI*/
YUI.add('SellATweet', function(Y, NAME) {
    "use strict";

    Y.namespace('mojito.controllers')[NAME] = {

        index: function(ac) {
             ac.done({
                status: 'Mojito is working.'
            });
        }
    };

}, '0.0.1', {requires: ['mojito']});
