/*global YUI*/

// A wrapper for REST calls.
YUI.add("rest", function (Y, NAME) {

    "use strict";

    var LOG = new Y.Logger(NAME);

    /**
     * Default timeout to be used for any request.
     * Can be overridden by setting `timeout` property in the `config` object.
     * @const
     */
    var DEFAULT_TIMEOUT = 20000;

    /**
     * A library to make RESTful calls.
     * - Provides an easy way to make RESTful calls (GET / POST / PUT / DELETE).
     * - Handles logging the failure and other useful information for debugging for all outgoing requests.
     * - Capable of handling non-JSON & JSON responses.
     *
     * Config Options:
     *  logResponse: Boolean. Indicates if the response content needs to be logged to the file in case of success. (Defaults to false).
     *  json: Boolean. Indicates that the response content is expected to be JSON. In this case, this library
     *       shall take care of parsing the response body into an JS object. (Defaults to true).
     *  headers: Object. Key-value pairs of HTTP headers to be set.
     *  timeout: Number. Threshold time in milliseconds after which the request will be aborted. Defaults to `20000` (20 seconds).
     *
     * NOTE: Always use this library to make outgoing network requests on HTTP / HTTPS, so that all outgoing network calls are accounted for in logs.
     * @class REST
     * @namespace Y
     */
    Y.REST = {

        /** @private */
        _doRequest: function (method, url, params, config, callback) {
            LOG.debug("Starting a " + method + " request to " + url);
            var start = new Date().getTime(),
                logResponse = config && config.logResponse === true,
                cbFn = function (err, response) {
                    var httpStatus = err ? err.statusCode : response.getStatusCode(),
                        duration = new Date().getTime() - start,
                        json = config.json !== false;

                    var logStruct = {
                        method: method,
                        url: url,
                        params: params,
                        /*config: config,*/
                        duration: duration + "ms",
                        httpStatus: httpStatus
                    };
                    if (err) {
                        logStruct.response = err.responseText;
                        if (err instanceof Error) {
                            logStruct.error = err.message;
                        }

                        // error because of timeout
                        if (err.status === 0) {
                            logStruct.error = err.statusText;
                        }

                        LOG.error("REST request: " + JSON.stringify(logStruct));
                        callback(err, null);
                        return;
                    }

                    // If the response is not expected to be JSON, emit out the raw response
                    if (!json) {
                        LOG.info("REST request: " + JSON.stringify(logStruct));
                        callback(null, response);
                        return;
                    }

                    try {
                        response = JSON.parse(response.getBody());
                        if (logResponse) {
                            logStruct.response = response;
                        }
                    } catch (ex) {
                        logStruct.response = response.getBody();
                        logStruct.error = "Invalid JSON [" + ex.message + "]";
                        LOG.error("REST request: " + JSON.stringify(logStruct));
                        callback(ex, null);
                        return;
                    }

                    LOG.info("REST request: " + JSON.stringify(logStruct));
                    callback(err, response);
                };

            if (config.timeout === undefined || config.timeout === null) {
                config.timeout = DEFAULT_TIMEOUT;
            }
            Y.mojito.lib.REST[method](url, params, config, cbFn);
        },

        /**
         * Makes a GET request to specified URL
         * @method GET
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        GET: function (url, params, config, callback) {
            this._doRequest("GET", url, params, config, callback);
        },


        /**
         * Makes a POST request to specified URL
         * @method POST
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        POST: function (url, params, config, callback) {
            this._doRequest("POST", url, params, config, callback);
        },


        /**
         * Makes a PUT request to specified URL
         * @method PUT
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        PUT: function (url, params, config, callback) {
            this._doRequest("PUT", url, params, config, callback);
        },


        /**
         * Makes a DELETE request to specified URL
         * @method DELETE
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        DELETE: function (url, params, config, callback) {
            this._doRequest("DELETE", url, params, config, callback);
        }
    };

}, "0.0.1", {requires: ["mojito-rest-lib", "logger"]});
