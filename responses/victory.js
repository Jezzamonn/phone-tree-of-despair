const { playSound } = require('./common');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function victory1(twiml) {
    playSound(twiml, 'victory/victory-intro.mp3');
    playSound(twiml, 'victory/victory-ending1.mp3');
    playSound(twiml, 'victory/victory-goodbye.mp3');
}

/**
 * @param {VoiceResponse} twiml
 */
function victory2(twiml) {
    playSound(twiml, 'victory/victory-intro.mp3');
    playSound(twiml, 'victory/victory-ending2.mp3');
    playSound(twiml, 'victory/victory-goodbye.mp3');
}

module.exports = {
    victory1,
    victory2,
};