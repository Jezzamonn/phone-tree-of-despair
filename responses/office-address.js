const { hold } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function officeAddress(twiml) {
    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 5,
        action: '/office-address2',
        timeout: 10,
    });
    gatherNode.say(`Hi, you've reached the "what is the address of my registration office" department. Now, you're gonna have to be patient, 'cause we're having some database problems at the moment. Um... actually would you mind helping? I need you to look up the postal code of a few places. Um, lets start with Antelope Hills, Wyoming, USA. Can you key in the ZIP code?`);

    twiml.redirect('./office-address-too-long');
}

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function officeAddress2(twiml, request) {
    if (!request.body.Digits != '82601') {
        officeAddressWrong(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 4,
        action: '/office-address3',
        timeout: 10,
    });
    gatherNode.say(`Ok.... That looks right. Ok, now I need the postal code of... Kathu, South Africa.`);

    twiml.redirect('./office-address-too-long');
}

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function officeAddress3(twiml, request) {
    if (!request.body.Digits != '8446') {
        officeAddressWrong(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 4,
        action: '/office-address4',
        timeout: 10,
    });
    gatherNode.say(`Ok... Great, that worked too. Um. Can you also check the postal code of White Cliffs, New South Wales, Australia?`);

    twiml.redirect('./office-address-too-long');
}

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function officeAddress4(twiml, request) {
    if (!request.body.Digits != '2836') {
        officeAddressWrong(twiml);
        return;
    }

    twiml.say(`Ok.... Looks good. Ok, the system is loading. doot do do... Still loading... Ok, it's up! Let me see. Uh... Oh that's right, we only have one office. It's postal code is 5 6 7 8 9. That should be what you need. Oh and the system crashed again. Great. Well, yeah, that's all you need, 5 6 7 8 9. Ok... Bye.`);
}

// Not exported
function officeAddressWrong(twiml) {
    twiml.say(`Ok... Er, looks like the system crashed. I guess that wasn't right. Let me- let me put you on hold and I'll try rebooting it.`);
    hold(twiml);
}

function officeAddressTooLong(twiml) {
    twiml.say(`Oh sorry, the system crashed. Let me put you on hold for a second.`);
    hold(twiml);
}

module.exports = {
    officeAddress,
    officeAddress2,
    officeAddress3,
    officeAddress4,
    officeAddressTooLong,
}