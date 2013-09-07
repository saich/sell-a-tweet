/*global YUI*/

// A simple logger interface, which writes to console through `Y.log`.

YUI.add("logger", function (Y) {

    "use strict";

    /**
     * @class Logger
     * @constructor
     * @param {string=} category (optional) Log category, generally the class/module name
     * @private
     */
    function Logger(category) {
        /** @private */
        this.name_ = category;
    }

    Logger.prototype = {
        debug: function (str) {
            Y.log(str, "debug", this.name_);
        },

        info: function (str) {
            Y.log(str, "info", this.name_);
        },

        warn: function (str) {
            Y.log(str, "warn", this.name_);
        },

        error: function (str) {
            Y.log(str, "error", this.name_);
        }
    };

    // The Logger class can be accessed via: Y.Logger
    Y.Logger = Logger;

});