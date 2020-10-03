const VoiceResponse = require('twilio').twiml.VoiceResponse;

const handleCheckExtension = (request, response) => {
    const twiml = new VoiceResponse();

    // If the user entered digits, process their request
    switch (request.body.Digits) {
        case '111':
            twiml.redirect('/registration');
            break;
        default:
            twiml.say("Sorry, that's not a valid response. Please hold.");
            twiml.play('https://demo.twilio.com/docs/classic.mp3');
            break;
    }

    response.type('text/xml');
    response.send(twiml.toString());
};

module.exports = {
    handleCheckExtension
};
