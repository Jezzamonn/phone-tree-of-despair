const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const { entry } = require('./responses/entry.js');
const { checkExtension } = require('./responses/check-extension.js');
const { moreInfo } = require('./responses/more-info.js');
const { registration, registration2, registration3, registrationFail } = require('./responses/registration.js');
const { handleRequest } = require('./responses/common.js');

const app = express();
const port = process.env.PORT || 8080;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));


// Create a routes that will handle Twilio webhook requests, sent as an
// HTTP POST request.

app.post('/entry', handleRequest(entry));
app.post('/check-extension', handleRequest(checkExtension));
app.post('/more-info', handleRequest(moreInfo));
app.post('/registration', handleRequest(registration));
app.post('/registration2', handleRequest(registration2));
app.post('/registration3', handleRequest(registration3));
app.post('/registration-fail', handleRequest(registrationFail));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
