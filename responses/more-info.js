const { playSound } = require('./common');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function moreInfo(twiml) {
    // twiml.say(
    //     "Once again, welcome to the Phone Tree of Despair. This is a game made for loo dum dar ray 47 by Jez Swanson.");
    // twiml.pause();
    // twiml.say(
    //     "First, some disclaimers. While this game sometimes uses your voice as input, " +
    //     "it does not store any voice recordings. It also does not store your phone number.");
    // twiml.pause();
    // twiml.say(
    //     "Ok, it looks like you're trying to renew your registration. That's great." +
    //     "You'll get to navigate our state-of-the-art, user-friendly phone system in order to do it!" +
    //     "Your first stop should be the registrations office. To get there, type the extension code 111 at the main menu.");
    // twiml.pause();
    // twiml.say(
    //     "One last thing. Our hold system tends to get people stuck in a loop. " +
    //     "If you're ever put on hold, or hear hold music, you should hang up and try calling again.");
    // twiml.pause();
    // twiml.say(
    //     "Alright, good luck!");
    // twiml.pause();
    playSound(twiml, 'more-info.mp3');

    twiml.redirect('/entry');
}

module.exports = {
    moreInfo
};