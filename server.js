"use strict";

process.chdir(__dirname);

var path = require('path');
var Mojito = require('mojito');
var config = require('config');

/* Set the allowed number of parallel http requests to a host.
 * The default value, if not set is 5.
 * Since we use a single host for all APIs, this small limit might be 
 * a bottlneck for us. We need to increase this number, and also 
 * keep this value in acceptable limits to avoid DOSing the server.
 */
require("http").globalAgent.maxSockets = config.maxSockets.http;


// Mapping from NODE_ENV to the Mojito's contexts.
// Mojito's contexts are not used right now.
var CONTEXTS = {
    "development": {environment: "dev"},
    "testing": {environment: "test"},
    "production": {environment: "prod"}
};

var currentEnv = process.env.NODE_ENV || "development";

var options = {
    port: process.env.PORT || config.port
};

if (CONTEXTS.hasOwnProperty(currentEnv)) {
    options.context = CONTEXTS[currentEnv];
}

var app = Mojito.createServer(options);

app.listen(null, null, function (err) {
    if (!err) {
        var appManifest = require(path.join(__dirname, '/package.json'));
        console.log("\n\u2714 " + appManifest.name + " v" + appManifest.version + " has started on http://127.0.0.1:" + options.port + "/\n");
    }
});
