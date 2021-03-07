const entryResponses = require('./entry.js');
const checkExtensionResponses = require('./check-extension.js');
const moreInfoResponses = require('./more-info.js');
const registrationResponses = require('./registration.js');
const directoryResponses = require('./directory.js');
const addressResponses = require('./address.js');
const officeAddressResponses = require('./office-address.js');
const datetimeResponses = require('./datetime.js');
const idResponses = require('./id.js');
const victoryResponses = require('./victory.js');
const { ActionList } = require('../model/action-list.js');

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

function sayAll() {
    const actionList = new ActionList().play('beep.mp3');
    for (const responseGroup of responseGroups) {
        for (const responseName of Object.keys(responseGroup)) {
            const as = responseGroup[responseName]();
            for (const action of as.actions) {
                if (action.type == 'say') {
                    actionList.actions.push(action);
                    actionList.play('beep.mp3');
                }
            }
        }
    }
    return actionList;
}

module.exports = {
    sayAll,
}