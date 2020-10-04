const { hold, playSound, getSpeechAnswer } = require('./common');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function id(twiml) {
    // twiml.say(`Hi, this is the ID department. We can look up your registration ID here. First, I'll need your name.`)
    playSound(twiml, 'id/id-intro.mp3');
    twiml.gather({
        input: 'speech',
        action: '/id-name1',
        hints: 'James Smith',
        timeout: 3,
    });

    twiml.redirect('./id-name-no-response');
}

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function idName1(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (answer.includes('james') && answer.includes('smith')) {
        idNameCorrect(twiml);
        return;
    }
    if (answer == '') {
        twiml.redirect('/id-name-no-response');
        return;
    }

    // twiml.say(`Hm, we don't have anything for that name. Maybe you're registered under a different name? Any idea what that would be?`);
    playSound(twiml, 'id/id-no-name1.mp3');
    twiml.gather({
        input: 'speech',
        action: '/id-name2',
        hints: 'James Smith',
        timeout: 3,
    });

    twiml.redirect('./id-name-no-response');

}

/**
 * @param {VoiceResponse} twiml
 * @param {Request} request
 */
function idName2(twiml, request) {
    const answer = getSpeechAnswer(request);
    if (answer.includes('james') && answer.includes('smith')) {
        idNameCorrect(twiml);
        return;
    }
    if (answer == '') {
        twiml.redirect('/id-name-no-response');
        return;
    }

    // twiml.say(`No, nothing for that either. Let me transfer you to our naming department.`);
    playSound(twiml, 'id/id-no-name2.mp3');
    hold(twiml);
}

// Not exported
function idNameCorrect(twiml) {
    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 4,
        action: '/id-challenge2',
        timeout: 10,
    });
    // gatherNode.say(`Ah, great, James Smith. (as if reading from the screen) Pin number 2 4 3 8, Session identifier 9 0, Flange-tron code 6 1 2, Isotope number 97 thousand, 6 hundred and 48. Ok great. Now, before I can give you your registration ID, I'll need some information to confirm your identity. First, can I have your personal pin number? Just key it in on the number pad there.`);
    playSound(gatherNode, 'id/id-challenge-intro.mp3');

    twiml.redirect('./id-challenge-wrong');
}

function idChallenge2(twiml, request) {
    if (request.body.Digits != '2438') {
        idChallengeWrong(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 3,
        action: '/id-challenge3',
        timeout: 10,
    });
    // gatherNode.say(`Ok, now I'll need your Flange-tron code.`);
    playSound(gatherNode, 'id/id-flangetron.mp3');

    twiml.redirect('./id-challenge-wrong');
}

function idChallenge3(twiml, request) {
    if (request.body.Digits != '612') {
        idChallengeWrong(twiml);
        return;
    }

    const gatherNode = twiml.gather({
        input: 'dtmf',
        numDigits: 5,
        action: '/id-challenge4',
        timeout: 10,
    });
    // gatherNode.say(`Ok, and now your isotope number?`);
    playSound(gatherNode, 'id/id-isotope.mp3');

    twiml.redirect('./id-challenge-wrong');
}

function idChallenge4(twiml, request) {
    if (request.body.Digits != '97648') {
        idChallengeWrong(twiml);
        return;
    }

    // twiml.say(`Alright! You are indeed James Smith! Your registration number is 5 4 0 0 2. Have a good day!`);
    playSound(twiml, 'id/id-success.mp3');
}

function idNameNoResponse(twiml) {
    // twiml.say(`Sorry, I didn't catch that. Let me put you on hold.`);
    playSound(twiml, 'id/id-didnt-catch-that.mp3');
    hold(twiml);
}

function idChallengeWrong(twiml) {
    // twiml.say(`Oh! Sorry, that doesn't look correct. Let me put you on hold, while I... figure out what to do (in background: Gary we got an imposter!)`);
    playSound(twiml, 'id/id-challenge-wrong.mp3');
    hold(twiml);
}

module.exports = {
    id,
    idName1,
    idName2,
    idChallenge2,
    idChallenge3,
    idChallenge4,
    idNameNoResponse,
    idChallengeWrong,
}