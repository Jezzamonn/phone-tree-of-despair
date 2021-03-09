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

    // Add extra ones that got left out
    const extraThings = new ActionList()
        .say("That's Bob's office")
        .say("Great. It looks like you're trying to renew your registration. I'll need three things from you: Your registration ID, your registration office address, and the date of your last renewal.")
        .say('First, key in your 5 digit registration ID.')
        .say('Ok. Now key in the 5 digit postal code for the registration office.')
        .say('Ok. Now key in the date of your last renewal. First enter the year, then the month, then the day.')
        .say("Alright, that all looks correct! Your registration is now renewed. Before you leave, can you rate your customer experience today?")
        .say('Please enter a number from 1 to 5.')
        .say(`That's very nice of you to say that. Thank you for your rating.`)
        .say('I see. Thank you for your rating.')
        .say('How dare you.')
        .say(`That's K. A. T. H. U.`, {voice: 'man'})

    sayActions.push(...extraThings.actions);

    const actionList = new ActionList()
        .play('beep3.mp3')
    for (const action of sayActions) {
        actionList.actions.push(action);
        actionList.play('beep3.mp3');
    }
    return actionList;
}

module.exports = {
    sayAll,
}