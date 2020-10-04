const { playSound } = require('./common');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function directory(twiml) {
    playSound(twiml, 'directory/directory.mp3');
    twiml.pause();
    twiml.redirect('/entry');
};

module.exports = {
    directory,
}