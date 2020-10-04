const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * @param {VoiceResponse} twiml
 */
function datetime(twiml) {
    twiml.say({voice: 'man'}, `This is the International Date Time Zone Consortium. The datetime of your last renewal, as a Unix Timestamp, is 1 5 7 4. 7 2 6 4. 0 0.
    If you just need the day, it was a Tuesday.`)
    twiml.pause();
    twiml.redirect('/entry');
};

module.exports = {
    datetime,
}