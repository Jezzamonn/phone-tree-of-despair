const express = require('express');
const cors = require('cors');
const urlencoded = require('body-parser').urlencoded;
const decamelize = require('decamelize');

const { handleRequest } = require('./responses/common.js');
const { generateToken } = require('./responses/token.js');

const entryResponses = require('./responses/entry.js');
const checkExtensionResponses = require('./responses/check-extension.js');
const moreInfoResponses = require('./responses/more-info.js');
const registrationResponses = require('./responses/registration.js');
const directoryResponses = require('./responses/directory.js');
const addressResponses = require('./responses/address.js');
const officeAddressResponses = require('./responses/office-address.js');
const datetimeResponses = require('./responses/datetime.js');
const idResponses = require('./responses/id.js');
const victoryResponses = require('./responses/victory.js');

const responseGroups = [
    entryResponses,
    checkExtensionResponses,
    moreInfoResponses,
    registrationResponses,
    directoryResponses,
    addressResponses,
    officeAddressResponses,
    datetimeResponses,
    idResponses,
    victoryResponses,
]

const app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

// Create routes that will handle Twilio webhook requests, sent as
// HTTP POST requests.
const supportedPaths = [];

for (const responseGroup of responseGroups) {
    for (const responseName of Object.keys(responseGroup)) {
        const path = '/' + decamelize(responseName, '-');
        app.post(path, handleRequest(responseGroup[responseName]));
        supportedPaths.push(path);
    }
}

// Bonus API Key endpoint
// TODO: CORS??
app.post('/token', cors(), generateToken);
supportedPaths.push('/token (bonus!)')

module.exports = {
    app,
    supportedPaths,
};