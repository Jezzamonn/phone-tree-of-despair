const { hold, playSound, getSpeechAnswer } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function address(twiml) {
    // twiml.say(`Hi, this is the addressing office. I'm currently on lunch break actually, is this something that can wait?`);
    playSound(twiml, 'addressing/addressing-intro.mp3');
    twiml.gather({
        input: 'speech',
        action: '/address-can-wait',
        hints: 'yes, no',
        timeout: 3,
    });

    twiml.redirect('./address-can-wait');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function addressCanWait(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (!answer.startsWith('n') && !answer.includes('no')) {
        // twiml.say(`Ok great. I'll put you on hold.`);
        playSound(twiml, 'addressing/addressing-can-wait.mp3');
        hold(twiml);
        return;
    }

    // twiml.say(`No? Ok, well, I'm almost done with this crossword. If you could help me with the last few clues, then I should be able to help you with your problem.
    // Alright, let's see... 16 Down. A 6 letter word for "coffee", starts with a C.`);
    playSound(twiml, 'addressing/addressing-cant-wait.mp3');
    playSound(twiml, 'addressing/addressing-coffee-hint.mp3');
    twiml.gather({
        input: 'speech',
        action: '/address-clue1',
        timeout: 3,
        hints: 'coffee',
    });

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function addressClue1(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (!answer.includes('coffee')) {
        addressClueWrong(twiml);
        return;
    }

    // twiml.say(`Coffee! That it! Ok, 3 Across. Baby feline. 6 letters.`);
    playSound(twiml, 'addressing/addressing-kitten-hint.mp3');
    twiml.gather({
        input: 'speech',
        action: '/address-clue2',
        timeout: 3,
        hints: 'kitten',
    });

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function addressClue2(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (!answer.includes('kitten')) {
        addressClueWrong(twiml);
        return;
    }

    // twiml.say(`Yup, kitten fits. Next one: 4 Down. Element with 8 electrons. And its 7 letters.`);
    playSound(twiml, 'addressing/addressing-oxygen-hint.mp3');
    twiml.gather({
        input: 'speech',
        action: '/address-clue3',
        timeout: 3,
        hints: 'oxygen',
    });

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function addressClue3(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (!answer.includes('oxygen')) {
        addressClueWrong(twiml);
        return;
    }

    // twiml.say(`Oxygen fits! Ok, last one: 1 Across. Another word for quiet. 6 letters long, the second letter is 'I' and the third letter is 'L'.`);
    playSound(twiml, 'addressing/addressing-silent-hint.mp3');
    twiml.gather({
        input: 'speech',
        action: '/address-clue4',
        timeout: 3,
        hints: 'silent',
    });

    twiml.redirect('./address-clue-too-long');
};

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function addressClue4(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (!answer.includes('silent')) {
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
    addressClue2,
    addressClue3,
    addressClue4,
    addressClueTooLong,
}