/*global YUI*/

// A wrapper for InstaMojo's REST calls.
YUI.add("instamojo", function (Y, NAME) {
    "use strict";

    var config = require("config");
    var REST = Y.REST;
    var LOG = new Y.Logger(NAME);

    function InstaMojo(options) {
        this._endpoint = options.endpoint || config.instamojo.endpoint;
        this._appid = options.appId || config.instamojo.appid;
        this._authtoken = options.authtoken;
    }

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

        REST[method](url, params, config, callback);
    };

    Y.InstaMojo = InstaMojo;

}, "0.1", {requires: ["rest", "logger"]});