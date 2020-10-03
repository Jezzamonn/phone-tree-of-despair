const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const { handleEntry } = require('./responses/entry.js');
const { handleCheckExtension } = require('./responses/check-extension.js');
const { handleMoreInfo } = require('./responses/more-info.js');
const { handleRegistration } = require('./responses/registration.js');

const app = express();
const port = process.env.PORT || 8080;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));


// Create a routes that will handle Twilio webhook requests, sent as an
// HTTP POST request.

app.post('/entry', handleEntry);
app.post('/check-extension', handleCheckExtension);
app.post('/more-info', handleMoreInfo);
app.post('/registration', handleRegistration);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
