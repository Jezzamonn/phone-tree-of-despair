const { getRegistrationId, getRegistrationDate, getRegistrationPostalCode } = require('./answers');
const { ActionList } = require('../model/action-list');

function registration() {
    return new ActionList()
        // .say('Welcome to the registration office. May I have your name?')
        .play('registration/welcome-to-the-registration-office.mp3')
        .pause()
        .pause()
        .pause()
        .getSpeech({
            responseDestination: '/registration-name-response',
            hints: ['yes', 'no'],
            timeout: 3,
            whileWaiting: new ActionList()
                // .say('I got "James Smith", is that correct?')
                .play('registration/i-got-james-smith.mp3')
                .pause(),
        })
        .redirect('/registration-fail');
};

function registrationNameResponse({speech=''}={}) {
    if (!speech.toLowerCase().includes('yes')) {
        return registrationFail();
    }

    return new ActionList()
        // .say("Great. It looks like you're trying to renew your registration. I'll need three things from you: Your registration ID, your registration office address, and the date of your last renewal.")
        .play('registration/great-it-looks-like-youre-trying-to-renew-your-registration.mp3')
        .getDigits({
            responseDestination: '/registration-id-response',
            numDigits: 5,
            timeout: 10,
            whileWaiting: new ActionList()
                // .say('First, key in your 5 digit registration ID.'),
                .play('registration/first-key-in-your-five-digit-registration-id.mp3'),
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
                // .say('Ok. Now key in the 5 digit postal code for the registration office.'),
                .play('registration/ok-now-key-in-the-five-digit-postal-code.mp3'),
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
                // .say('Ok. Now key in the date of your last renewal. First enter the year, then the month, then the day.'),
                .play('registration/ok-now-key-in-the-date-of-your-last-renewal.mp3'),
        })
        .redirect('/registration-incorrect');
}

function registrationDateResponse({digits=''}={}) {
    if (digits != getRegistrationDate()) {
        return registrationIncorrect();
    }

    return new ActionList()
        // .say("Alright, that all looks correct! Your registration is now renewed. Before you leave, can you rate your customer experience today?")
        .play('registration/alright-that-all-looks-correct.mp3')
        .getDigits({
            responseDestination: '/registration-rating-response',
            numDigits: 1,
            timeout: 5,
            whileWaiting: new ActionList()
                // .say('Please enter a number from 1 to 5.'),
                .play('registration/please-enter-a-number.mp3')
        })
        .redirect('/registration-rating-response');
};

function registrationRatingResponse({digits=''}={}) {
    if (digits == '4' ||
        digits == '5') {
        return new ActionList()
            // .say(`That's very nice of you to say that. Thank you for your rating.`)
            .play('registration/thats-very-nice-of-you-to-say.mp3')
            .pause()
            .redirect('/victory1');
    }
    if (digits == '2' ||
        digits == '3') {
        return new ActionList()
            // .say('I see. Thank you for your rating.')
            .play('registration/i-see-thank-you-for-your-rating.mp3')
            .pause()
            .redirect('/victory1');
    }
    if (digits == '1') {
        return new ActionList()
            // .say('How dare you.')
            .play('registration/how-dare-you.mp3')
            .pause()
            .redirect('/victory1');
    }

    return new ActionList()
        // .say('Error. That is not a number from 1 to 5. Error. Error.')
        .play('registration/error-that-is-not-a-number.mp3')
        .play('kill.mp3')
        .redirect('/victory2');
};

function registrationIncorrect() {
    return new ActionList()
        // .say("Sorry, that doesn't look correct. If you need to look up information about your registration, try contacting the other departments. You can find their extension codes by accessing the extension directory by pressing 1 2 3 at the main menu. I'll transfer you there now.")
        .play('registration/sorry-that-doesnt-look-correct.mp3')
        .redirect('/entry');
}

function registrationFail() {
    return new ActionList()
        // .say('Sorry about that. Please hold')
        .play('registration/sorry-about-that-please-hold.mp3')
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
