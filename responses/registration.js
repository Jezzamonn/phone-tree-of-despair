const VoiceResponse = require('twilio').twiml.VoiceResponse;

const handleRegistration = (request, response) => {
    const twiml = new VoiceResponse();

    twiml.say({voice: 'alice', language: 'en-GB'},
        'Welcome to the registration office. May I have your name?');

    response.type('text/xml');
    response.send(twiml.toString());
};

module.exports = {
    handleRegistration
};
