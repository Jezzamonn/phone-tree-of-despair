const { hold, playSound, getSpeechAnswer } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function address(twiml) {
    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/address-can-wait',
        hints: 'yes, no',
        timeout: 3,
    });
    // twiml.say(`Hi, this is the addressing office. I'm currently on lunch break actually, is this something that can wait?`);
    playSound(gatherNode, 'addressing/addressing-intro.mp3');
    gatherNode.pause();

    twiml.redirect('./address-can-wait');
};

/**
 * @param {VoiceResponse} twiml
 */
function addressCanWait(twiml, {speech=''}={}) {
    if (!speech.startsWith('n') && !speech.includes('no')) {
        // twiml.say(`Ok great. I'll put you on hold.`);
        playSound(twiml, 'addressing/addressing-can-wait.mp3');
        hold(twiml);
        return;
    }

    // twiml.say(`No? Ok, well, I'm almost done with this crossword. If you could help me with the last few clues, then I should be able to help you with your problem.
    // Alright, let's see... 16 Down. A 6 letter word for "coffee", starts with a C.`);
    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/address-clue1',
        timeout: 3,
        hints: 'coffee',
    });
    playSound(gatherNode, 'addressing/addressing-cant-wait.mp3');
    playSound(gatherNode, 'addressing/addressing-coffee-hint.mp3');
    gatherNode.pause();

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 */
function addressClue1(twiml, {speech=''}={}) {
    if (!speech.includes('coffee')) {
        addressClueWrong(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/address-clue3',
        timeout: 3,
        hints: 'oxygen',
    });
    playSound(gatherNode, 'addressing/addressing-oxygen-hint.mp3');
    gatherNode.pause();

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 */
function addressClue3(twiml, {speech=''}={}) {
    if (!speech.includes('oxygen')) {
        addressClueWrong(twiml);
        return;
    }

    // twiml.say(`Oxygen fits! Ok, last one: 1 Across. Another word for quiet. 6 letters long, the second letter is 'I' and the third letter is 'L'.`);
    const gatherNode = twiml.gather({
        input: 'speech',
        action: '/address-clue4',
        timeout: 3,
        hints: 'silent',
    });
    playSound(gatherNode, 'addressing/addressing-silent-hint.mp3');
    gatherNode.pause();

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 */
function addressClue4(twiml, {speech=''}={}) {
    if (!speech.includes('silent')) {
        addressClueWrong(twiml);
        return;
    }

    // twiml.say(`Silent! Of course! Ok, that's all of them! Now, lets take a look at your problem.`);
    // twiml.pause();
    // twiml.say(`Hm... Oh, are you trying to find the address of your registration office? We don't do that here. This is the addressing office, for writing names and addresses on envelopes. If you want the find the address of your registration office, you'll need to call Sam on the extension 828.
    // Alright, well thanks for your help with the crossword! Have a nice day.`);
    playSound(twiml, 'addressing/addressing-correct.mp3');
};

// Not exported
function addressClueWrong(twiml) {
    // twiml.say(`Hm, no, that's not it. Let me put you on hold while I think about it.`);
    playSound(twiml, 'addressing/addressing-clue-wrong.mp3');
    hold(twiml);
}

function addressClueTooLong(twiml) {
    // twiml.say(`Not sure? Yeah me neither. Let me put you on hold while I think about it.`);
    playSound(twiml, 'addressing/addressing-too-long.mp3');
    hold(twiml);
}

module.exports = {
    address,
    addressCanWait,
    addressClue1,
    addressClue3,
    addressClue4,
    addressClueTooLong,
}