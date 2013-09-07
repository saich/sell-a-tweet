/*global YUI:false, YUITest:false*/

YUI.add("instamojo-tests", function (Y, NAME) {
    "use strict";

    var TEST_USERNAME = "saiprasad";

    var instamojo = new Y.InstaMojo();
    var suite = new YUITest.TestSuite(NAME),
        A = YUITest.Assert;

    suite.add(new YUITest.TestCase({
        "name": "Auth Tests",
        "wrong login": function () {
            var self = this;
            instamojo.auth(TEST_USERNAME, "wrong password", function (err, results) {
                self.resume(function () {
                    A.isNull(err);
                    A.isNotNull(results);
                    A.isFalse(results.success);
                    A.isFalse(!!results.token);
                });
            });
            this.wait();
        },

        "correct login": function () {
            var self = this;
            var password = process.env.TEST_PASSWORD;
            if (!password) {
                A.fail("Password needs to be set.. Try `TEST_PASSWORD=<password> npm test`");
            }
            instamojo.auth(TEST_USERNAME, password, function (err, results) {
                self.resume(function () {
                    A.isNull(err);
                    A.isNotNull(results);
                    A.isTrue(results.success);
                    A.isString(results.token);
                    A.areSame(results.token, instamojo.getAuthToken(), "InstaMojo instance must cache authtoken after successful auth");
                });
            });
            this.wait();
        },

        "revoke auth": function () {
            var self = this;
            instamojo.deleteAuthToken(function (err, results) {
                self.resume(function () {
                    A.isNull(err);
                    A.isNotNull(results);
                    A.isTrue(results.success);
                });
            });
            this.wait();
        }
    }));

    YUITest.TestRunner.add(suite);

}, '0.1', {requires: ['mojito-test', 'instamojo']});