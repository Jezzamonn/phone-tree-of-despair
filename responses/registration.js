const { getRegistrationId, getRegistrationDate, getRegistrationPostalCode } = require('./answers');
const { ActionList } = require('../model/action-list');

function registration() {
    return new ActionList()
        .say('Welcome to the registration office. May I have your name?')
        .pause()
        .pause()
        .pause()
        .getSpeech({
            responseDestination: '/registration-name-response',
            hints: ['yes', 'no'],
            timeout: 3,
            whileWaiting: new ActionList()
                .say('I got "James Smith", is that correct?')
                .pause(),
        })
        .redirect('./registration-fail');
};

function registrationNameResponse({speech=''}={}) {
    if (!speech.toLowerCase().includes('yes')) {
        return registrationFail();
    }

    return new ActionList()
        .say("Great. It looks like you're trying to renew your registration. I'll need three things from you: Your registration ID, your registration office address, and the date of your last renewal.")
        .getDigits({
            responseDestination: '/registration-id-response',
            numDigits: 5,
            timeout: 10,
            whileWaiting: new ActionList()
                .say('First, key in your 5 digit registration ID.'),
        })
        .redirect('/registration-incorrect');
};

function registrationIdResponse({digits=''}={}) {
    if (digits != getRegistrationId()) {
        return registrationIncorrect();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/registration-address-response',
            numDigits: 5,
            timeout: 10,
            whileWaiting: new ActionList()
                .say('Ok. Now key in the 5 digit postal code for the registration office.'),
        })
        .redirect('/registration-incorrect');
};

function registrationAddressResponse({digits=''}={}) {
    if (digits != getRegistrationPostalCode()) {
        return registrationIncorrect();
    }

    return new ActionList()
        .getDigits({
            responseDestination: '/registration-date-response',
            numDigits: 8,
            timeout: 10,
            whileWaiting: new ActionList()
                .say('Ok. Now key in the date of your last renewal. First enter the year, then the month, then the day.'),
        })
        .redirect('/registration-incorrect');
}

function registrationDateResponse({digits=''}={}) {
    if (digits != getRegistrationDate()) {
        return registrationIncorrect();
    }

    return new ActionList()
        .say("Alright, that all looks correct! Your registration is now renewed. Before you leave, can you rate your customer experience today?")
        .getDigits({
            responseDestination: '/registration-rating-response',
            numDigits: 1,
            timeout: 5,
            whileWaiting: new ActionList()
                .say('Please enter a number from 1 to 5.'),
        })
        .redirect('/registration-rating-response');
};

function registrationRatingResponse({digits=''}={}) {
    if (digits == '4' ||
        digits == '5') {
        return new ActionList()
            .say(`That's very nice of you to say that. Thank you for your rating.`)
            .pause()
            .redirect('/victory1');
    }
    if (digits == '2' ||
        digits == '3') {
        return new ActionList()
            .say('I see. Thank you for your rating.')
            .pause()
            .redirect('/victory1');
    }
    if (digits == '1') {
        return new ActionList()
            .say('How dare you.')
            .pause()
            .redirect('/victory1');
    }

    return new ActionList()
        .say('Error. That is not a number from 1 to 5. Error. Error.')
        .play('kill.mp3')
        .redirect('/victory2');
};

function registrationIncorrect() {
    return new ActionList()
        .say("Sorry, that doesn't look correct. If you need to look up information about your registration, try contacting the other departments. You can find their extension codes by accessing the extension directory by pressing 1 2 3 at the main menu. I'll transfer you there now.")
        .redirect('/entry');
}

function registrationFail() {
    return new ActionList()
        .say('Sorry about that. Please hold')
        .hold();
};

module.exports = {
    registration,
    registrationNameResponse,
    registrationIdResponse,
    registrationAddressResponse,
    registrationDateResponse,
    registrationRatingResponse,
    registrationIncorrect,
    registrationFail,
};
