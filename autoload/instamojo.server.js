/*global YUI*/

// A wrapper for InstaMojo's REST calls.
YUI.add("instamojo", function (Y, NAME) {
    "use strict";

    var config = require("config");
    var REST = Y.REST;
    var LOG = new Y.Logger(NAME);

    function InstaMojo(options) {
        options = options || {};
        this._endpoint = options.endpoint || config.instamojo.endpoint;
        this._appid = options.appId || config.instamojo.appid;
        this._authtoken = options.authtoken;
    }

    InstaMojo.prototype.getAuthToken = function () {
        return this._authtoken;
    };

    InstaMojo.prototype.request = function (method, url, params, config, callback) {
        LOG.debug(method + " request to: " + url);
        // Add the default headers required for InstaMojo APIs
        if (!config) { config = {}; }
        if (!config.headers) { config.headers = {}; }
        config.headers["X-App-Id"] = this._appid;
        if (this._authtoken) {
            config.headers["X-Auth-Token"] = this._authtoken;
        }

        url = this._endpoint + url;

        // TODO: Need a wrapper around callback to check if `success` is true or not..
        REST[method](url, params, config, callback);
    };

    InstaMojo.prototype.debug = function (callback) {
        this.request("/debug/", {}, {}, callback);
    };

    InstaMojo.prototype.auth = function (username, password, callback) {
        // Reset cached authtoken..
        this._authtoken = null;

        var self = this;
        this.request("POST", "/auth/", {
            username: username,
            password: password
        }, {}, function (err, result) {
            if (result && result.success) {
                self._authtoken = result.token;
            }
            callback(err, result);
        });
    };

    InstaMojo.prototype.deleteAuthToken = function (callback) {
        if (!this._authtoken) {
            process.nextTick(function () {
               callback(new Error("Auth Token doesn't exist! Nothing to delete!"), null);
            });
            return;
        }

        var self = this;
        this.request("DELETE", "/auth/" + this._authtoken + "/", {}, {}, function (err, result) {
            if (result && result.success) {
                self._authtoken = null;
                callback(err, result);
            }
        });
    };

    InstaMojo.prototype.listOffers = function (callback) {
        this.request("GET", "/offer/", {}, {}, callback);
    };

    InstaMojo.prototype.createOffer = function (params, callback) {
        this.request("POST", "/offer/", params, {}, callback);
    };

    InstaMojo.prototype.getOffer = function (slug, callback) {
        this.request("GET", "/offer/" + slug + "/", {}, {}, callback);
    };

    InstaMojo.prototype.archiveOffer = function (slug, callback) {
        this.request("DELETE", "/offer/" + slug + "/", {}, {}, callback);
    };

    InstaMojo.prototype.editOffer = function (slug, params, callback) {
        this.request("PUT", "/offer/" + slug + "/", params, {}, callback);
    };

    Y.InstaMojo = InstaMojo;

}, "0.1", {requires: ["rest", "logger"]});