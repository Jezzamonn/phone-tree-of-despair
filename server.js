const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const decamelize = require('decamelize');

const { handleRequest } = require('./responses/common.js');
const entryResponses = require('./responses/entry.js');
const checkExtensionResponses = require('./responses/check-extension.js');
const moreInfoResponses = require('./responses/more-info.js');
const registrationResponses = require('./responses/registration.js');
const directoryResponses = require('./responses/directory.js');
const addressResponses = require('./responses/address.js');
const officeAddressResponses = require('./responses/office-address.js');
const datetimeResponses = require('./responses/datetime.js');
const idResponses = require('./responses/id.js');

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
]

const app = express();
const port = process.env.PORT || 8080;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));


// Create routes that will handle Twilio webhook requests, sent as
// HTTP POST requests.
console.log('Supported paths:')
for (const responseGroup of responseGroups) {
    for (const responseName of Object.keys(responseGroup)) {
        const path = '/' + decamelize(responseName, '-');
        app.post(path, handleRequest(responseGroup[responseName]));
        console.log(`  ${path}`);
    }
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
