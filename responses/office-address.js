const { ActionList } = require('../model/action-list');

function officeAddress() {
    return new ActionList()
        .getDigits({
            responseDestination: '/office-address2',
            numDigits: 5,
            timeout: 20,
            whileWaiting: new ActionList()
                // .say(`Hi, you've reached the "what is the address of my registration office" department. Now, you're gonna have to be patient, 'cause we're having some database problems at the moment. Um... actually would you mind helping? I need you to look up the postal code of a few places. Um, lets start with Antelope Hills, Wyoming, USA. Can you key in the ZIP code?`)
                .play('office-address/office-address-intro.mp3'),
        })
        .redirect('./office-address-too-long');
}

function officeAddress2({digits=''}={}) {
    if (digits != '82601') {
        return officeAddressWrong();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/office-address3',
            numDigits: 4,
            timeout: 20,
            whileWaiting: new ActionList()
                // .say(`Ok.... That looks right. Ok, now I need the postal code of... Kathu, South Africa.`)
                .play('office-address/office-address-kathu.mp3')
                .say(`That's K. A. T. H. U.`, {voice: 'man'}),
        })
        .redirect('./office-address-too-long');
}

function officeAddress3({digits=''}={}) {
    if (digits != '8446') {
        return officeAddressWrong();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/office-address4',
            numDigits: 4,
            timeout: 20,
            whileWaiting: new ActionList()
                // .say(`Ok... Great, that worked too. Um. Can you also check the postal code of White Cliffs, New South Wales, Australia?`)
                .play('office-address/office-address-white-cliffs.mp3'),
        })
        .redirect('./office-address-too-long');
}

function officeAddress4({digits=''}={}) {
    if (digits != '2836') {
        return officeAddressWrong();
    }

    return new ActionList()
        // .say(`Ok.... Looks good. Ok, the system is loading. doot do do... Still loading... Ok, it's up! Let me see. Uh... Oh that's right, we only have one office. It's postal code is 5 6 7 8 9. That should be what you need. Oh and the system crashed again. Great. Well, yeah, that's all you need, 5 6 7 8 9. Ok... Bye.`);
        .play('office-address/office-address-correct.mp3');
}

// Not exported
function officeAddressWrong() {
    return new ActionList()
        // .say(`Ok... Er, looks like the system crashed. I guess that wasn't right. Let me- let me put you on hold and I'll try rebooting it.`);
        .play('office-address/office-address-wrong.mp3')
        .hold();
}

function officeAddressTooLong() {
    return new ActionList()
        // .say(`Oh sorry, the system crashed. Let me put you on hold for a second.`);
        .play('office-address/office-address-too-long.mp3')
        .hold();
}

module.exports = {
    officeAddress,
    officeAddress2,
    officeAddress3,
    officeAddress4,
    officeAddressTooLong,
}