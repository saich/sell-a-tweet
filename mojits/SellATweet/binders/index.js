/*global YUI*/

YUI.add("SellATweetBinderIndex", function (Y, NAME) {

    "use strict";

    Y.namespace("mojito.binders")[NAME] = {
        init: function (mojitoProxy) {
            this.mp = mojitoProxy;
        },

        bind: function (node) {
            this.node = node;
            if (Y.one("#login-form")) {
                // unauthorized user..
                return;
            }
            this.initPage();
        },

        initPage: function () {
            var twitterForm = Y.one("#twitter-form"),
                tweetsForm = Y.one("#tweets-form"),
                createOfferForm = Y.one("#create-offer-form");

            var self = this;
            twitterForm.on("submit", function (e) {
                e.preventDefault();
                self.fillTweets(Y.one("#twitter-screen-name").get("value"));
                return false;
            });

            tweetsForm.on("submit", function (e) {
                e.preventDefault();
                // TODO: Show the create form..
                var description = Y.all("input[name=tweet]").filter(":checked").item(0).get("parentNode").get("text");
                Y.one("#offer-description").set("text", description);
                return false;
            });
        },

        fillTweets: function (screenname) {
            var tmpl = '<label><input type="radio" name="tweet" value="{index}">{text}</label><br>';
            Y.io("/tweets.json", {
                data: "screenname=" + screenname,
                on: {
                    complete: function (id, o) {
                        var tweets;
                        try {
                            var content = "", index = 0;
                            tweets = JSON.parse(o.responseText);
                            tweets.forEach(function (tweet) {
                                content+= Y.Lang.sub(tmpl, {
                                    index: index++,
                                    text: tweet
                                });
                            });
                            Y.one("#tweets-list").setHTML(content);
                        } catch (ex) {
                            // TODO: Display error
                        }
                    }
                }
            });
        }
    };

}, "0.1", {requires: ["node", "io"]});