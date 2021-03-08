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
    const allActions = [];

    for (const responseGroup of responseGroups) {
        for (const responseName of Object.keys(responseGroup)) {
            const actionList = responseGroup[responseName]();
            allActions.push(...actionList.actions);
        }
    }
    // Find all nested actions
    for (let i = 0; i < allActions.length; i++) {
        const action = allActions[i];
        if (action.type == 'getDigits' || action.type == 'getSpeech') {
            // TODO: Probs have to check for null
            const subActions = action.whileWaiting?.actions ?? [];
            allActions.push(...subActions);
        }
    }

    const sayActions = [];
    for (const action of allActions) {
        if (action.type != 'say') {
            continue;
        }
        let hasMatch = false;
        for (const existingAction of sayActions) {
            if (action.text == existingAction.text && action.voice == existingAction.voice) {
                hasMatch = true;
                break;
            }
        }
        if (hasMatch) {
            continue;
        }
        sayActions.push(action);
    }

    const actionList = new ActionList().play('beep3.mp3');
    for (const action of sayActions) {
        actionList.actions.push(action);
        actionList.play('beep3.mp3');
    }
    return actionList;
}

module.exports = {
    sayAll,
}