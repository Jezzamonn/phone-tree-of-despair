const decamelize = require('decamelize');

const entryResponses = require('../../../responses/entry.js');
const checkExtensionResponses = require('../../../responses/check-extension.js');
const moreInfoResponses = require('../../../responses/more-info.js');
const registrationResponses = require('../../../responses/registration.js');
const directoryResponses = require('../../../responses/directory.js');
const addressResponses = require('../../../responses/address.js');
const officeAddressResponses = require('../../../responses/office-address.js');
const datetimeResponses = require('../../../responses/datetime.js');
const idResponses = require('../../../responses/id.js');
const victoryResponses = require('../../../responses/victory.js');

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
];

const responses = {};

for (const responseGroup of responseGroups) {
    for (const responseName of Object.keys(responseGroup)) {
        const path = '/' + decamelize(responseName, '-');
        const responseFn = responseGroup[responseName];
        responses[path] = responseFn;
    }
}

function getResponse(path) {
    return responses[path]();
}

module.exports = {
    getResponse,
}