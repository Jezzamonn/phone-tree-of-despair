// Code to get an auth token for Twilio.
// We don't authenicate the user other than ensure the request comes from
// the right URL.

const Twilio = require("twilio");
const { v4: uuidv4 } = require('uuid');

/**
 * @param {Request} request
 * @param {Response} response
 */
function generateToken(request, response) {
  // I think actually this needs to be different for each person.
  const identity = uuidv4();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const applicationSid = process.env.TWILIO_APP_SID;
  const apiKeySid = process.env.TWILIO_KEY_SID;
  const apiKeySecret = process.env.TWILIO_KEY_SECRET;

  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const accessToken = new AccessToken(accountSid, apiKeySid, apiKeySecret);
  accessToken.identity = identity;
  const grant = new VoiceGrant({
    outgoingApplicationSid: applicationSid,
    incomingAllow: false
  });
  accessToken.addGrant(grant);

  response.json({
      identity,
      token: accessToken.toJwt()
  });
};

module.exports = {
    generateToken,
}
