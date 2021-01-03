const { ActionList } = require('../model/action-list');

function id() {
    return new ActionList()
        // .say(`Hi, this is the ID department. We can look up your registration ID here. First, I'll need your name.`)
        .play('id/id-intro.mp3')
        .getSpeech({
            responseDestination: '/id-name1',
            hints: ['James Smith'],
            timeout: 3,
        })
        .redirect('./id-name-no-response');
}

function idName1({speech=''}={}) {
    if (speech.includes('james') && speech.includes('smith')) {
        return idNameCorrect();
    }
    if (speech == '') {
        return new ActionList()
            .redirect('/id-name-no-response');
    }

    return new ActionList()
        // .say(`Hm, we don't have anything for that name. Maybe you're registered under a different name? Any idea what that would be?`)
        .getSpeech({
            responseDestination: '/id-name2',
            hints: ['James Smith'],
            timeout: 3,
            whileWaiting: new ActionList()
                .play('id/id-no-name1.mp3'),
        })
        .redirect('./id-name-no-response');
}

function idName2({speech=''}={}) {
    if (speech.includes('james') && speech.includes('smith')) {
        return idNameCorrect();
    }
    if (speech == '') {
        return new ActionList()
            .redirect('/id-name-no-response');

    }

    return new ActionList()
        // .say(`No, nothing for that either. Let me transfer you to our naming department.`)
        .play('id/id-no-name2.mp3')
        .hold();
}

// Not exported
function idNameCorrect() {
    return new ActionList()
        .getDigits({
            responseDestination: '/id-challenge2',
            numDigits: 4,
            timeout: 10,
            whileWaiting: new ActionList()
                // .say(`Ah, great, James Smith. (as if reading from the screen) Pin number 2 4 3 8, Session identifier 9 0, Flange-tron code 6 1 2, Isotope number 97 thousand, 6 hundred and 48. Ok great. Now, before I can give you your registration ID, I'll need some information to confirm your identity. First, can I have your personal pin number? Just key it in on the number pad there.`)
                .play('id/id-challenge-intro.mp3'),
        })
        .redirect('./id-challenge-wrong');
}

function idChallenge2({digits=''}={}) {
    if (digits != '2438') {
        return idChallengeWrong();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/id-challenge3',
            numDigits: 3,
            timeout: 10,
            whileWaiting: new ActionList()
                // .say(`Ok, now I'll need your Flange-tron code.`)
                .play('id/id-flangetron.mp3'),
        })
        .redirect('./id-challenge-wrong');
}

function idChallenge3({digits=''}={}) {
    if (digits != '612') {
        return idChallengeWrong();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/id-challenge4',
            numDigits: 5,
            timeout: 10,
            whileWaiting: new ActionList()
                // .say(`Ok, and now your isotope number?`)
                .play('id/id-isotope.mp3'),
        })
        .redirect('./id-challenge-wrong');
}

function idChallenge4({digits=''}={}) {
    if (digits != '97648') {
        return idChallengeWrong();
    }

    return new ActionList()
        // .say(`Alright! You are indeed James Smith! Your registration number is 5 4 0 0 2. Have a good day!`)
        .play('id/id-success.mp3');
}

function idNameNoResponse() {
    return new ActionList()
        // .say(`Sorry, I didn't catch that. Let me put you on hold.`)
        .play('id/id-didnt-catch-that.mp3')
        .hold();
}

function idChallengeWrong() {
    return new ActionList()
        // .say(`Oh! Sorry, that doesn't look correct. Let me put you on hold, while I... figure out what to do (in background: Gary we got an imposter!)`)
        .play('id/id-challenge-wrong.mp3')
        .hold();
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