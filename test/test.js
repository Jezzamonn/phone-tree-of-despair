const { app } = require('../app.js');
const request = require('supertest');
const fs = require('fs/promises');
const path = require('path');
const { program } = require('commander');
const { expect } = require('chai');

program.option('--update-goldens', 'whether to update golden things instead of asserting');

program.parse(process.argv);

/**
 * Either compares the response to the golden, or if the update-goldens flag
 * is set, updates the golden instead.
 *
 * @param {String} responseText Text from the response
 * @param {String} goldenPath File path of the golden, relative to the goldens
 *     directory
 */
async function compareWithGolden(responseText, goldenPath) {
    const fullPath = path.join(__dirname, 'goldens', goldenPath);

    if (program.updateGoldens) {
        fs.writeFile(fullPath, responseText, {encoding: 'utf8'});
        return;
    }

    let goldenText;
    try {
        goldenText = await fs.readFile(fullPath, {encoding: 'utf8'});
    }
    catch (e) {
        throw Error(
            `Error reading golden: ${e.toString()}.\n\n` +
            `Received response:\n` +
            `${responseText}\n\n` +
            `Run \`npm run update-goldens\` to update it.`)
    }
    expect(responseText).to.equal(goldenText);
}

/**
 * @param {String} endPoint end point, with the slash at the start.
 */
async function checkEndPoint(endPoint, {digits=null, speech=null} = {}) {
    const baseName = endPoint.slice(1);
    let testName = baseName;
    if (digits != null) {
        testName += `_digits_${digits}`;
    }
    if (speech != null) {
        testName += `_speech_${speechResult}`;
    }
    const xmlName = testName + '.xml';

    it(testName, async function() {
        const testRequest = request(app).post(endPoint);
        if (digits != null) {
            testRequest.send(`Digits=${digits}`);
        }
        if (speech != null) {
            testRequest.send(`SpeechResult=${speechResult}`);
        }
        const response = await testRequest.expect(200);

        await compareWithGolden(response.text, xmlName);
    });
}

describe('entry', function() {
    checkEndPoint('/entry');
});

describe('check-extension', function() {
    checkEndPoint('/check-extension')
    checkEndPoint('/check-extension', {digits: '111'});
    checkEndPoint('/check-extension', {digits: '123'});
    checkEndPoint('/check-extension', {digits: '575'});
    checkEndPoint('/check-extension', {digits: '818'});
    checkEndPoint('/check-extension', {digits: '828'});

    checkEndPoint('/check-extension', {digits: '303'});
    checkEndPoint('/check-extension', {digits: '313'});
    checkEndPoint('/check-extension', {digits: '323'});
    checkEndPoint('/check-extension', {digits: '333'});
    checkEndPoint('/check-extension', {digits: '343'});
    checkEndPoint('/check-extension', {digits: '353'});
    checkEndPoint('/check-extension', {digits: '363'});
    checkEndPoint('/check-extension', {digits: '373'});
    checkEndPoint('/check-extension', {digits: '383'});
    checkEndPoint('/check-extension', {digits: '393'});

    checkEndPoint('/check-extension', {digits: '364'});

    checkEndPoint('/check-extension', {digits: '999'});
});

describe('more-info', function() {
    checkEndPoint('/more-info');
});

describe('registration', function() {
    checkEndPoint('/registration');

    checkEndPoint('/registration-name-response');
    checkEndPoint('/registration-name-response', {speech: 'no'});
    checkEndPoint('/registration-name-response', {speech: 'yes'});

    checkEndPoint('/registration-id-response');
    checkEndPoint('/registration-id-response', {digits: '99999'});
    checkEndPoint('/registration-id-response', {digits: '54002'});

    checkEndPoint('/registration-address-response');
    checkEndPoint('/registration-address-response', {digits: '99999'});
    checkEndPoint('/registration-address-response', {digits: '56789'});

    checkEndPoint('/registration-date-response');
    checkEndPoint('/registration-date-response', {digits: '99999999'});
    checkEndPoint('/registration-date-response', {digits: '20191126'});

    checkEndPoint('/registration-rating-response');
    checkEndPoint('/registration-rating-response', {digits: '1'});
    checkEndPoint('/registration-rating-response', {digits: '2'});
    checkEndPoint('/registration-rating-response', {digits: '3'});
    checkEndPoint('/registration-rating-response', {digits: '4'});
    checkEndPoint('/registration-rating-response', {digits: '5'});
    checkEndPoint('/registration-rating-response', {digits: '7'});

    checkEndPoint('/registration-incorrect');
    checkEndPoint('/registration-fail');
});

describe('directory', function() {
    checkEndPoint('/directory');
});

describe('address', function() {
    checkEndPoint('/address');
    checkEndPoint('/address-can-wait');
    checkEndPoint('/address-can-wait', {digits: 'yes'});
    checkEndPoint('/address-can-wait', {digits: 'no'});

    checkEndPoint('/address-clue1');
    checkEndPoint('/address-clue1', {speech: 'something'});
    checkEndPoint('/address-clue1', {speech: 'coffee'});

    checkEndPoint('/address-clue3');
    checkEndPoint('/address-clue3', {speech: 'something'});
    checkEndPoint('/address-clue3', {speech: 'oxygen'});

    checkEndPoint('/address-clue4');
    checkEndPoint('/address-clue4', {speech: 'something'});
    checkEndPoint('/address-clue4', {speech: 'silent'});

    checkEndPoint('/address-clue-too-long');
});

describe('office-address', function() {
    checkEndPoint('/office-address');

    checkEndPoint('/office-address2');
    checkEndPoint('/office-address2', {digits: '99999'});
    checkEndPoint('/office-address2', {digits: '82601'});

    checkEndPoint('/office-address3');
    checkEndPoint('/office-address3', {digits: '9999'});
    checkEndPoint('/office-address3', {digits: '8446'});

    checkEndPoint('/office-address4');
    checkEndPoint('/office-address4', {digits: '9999'});
    checkEndPoint('/office-address4', {digits: '2836'});

    checkEndPoint('/office-address-too-long');
});

describe('datetime', function() {
    checkEndPoint('/datetime');
});

describe('id', function() {
    checkEndPoint('/id');

    checkEndPoint('/id-name1');
    checkEndPoint('/id-name1', {speech: 'someone'});
    checkEndPoint('/id-name1', {speech: 'james smith'});

    checkEndPoint('/id-name2');
    checkEndPoint('/id-name2', {speech: 'someone'});
    checkEndPoint('/id-name2', {speech: 'james smith'});

    checkEndPoint('/id-challenge2');
    checkEndPoint('/id-challenge2', {digits: '9999'});
    checkEndPoint('/id-challenge2', {digits: '2438'});

    checkEndPoint('/id-challenge3');
    checkEndPoint('/id-challenge3', {digits: '999'});
    checkEndPoint('/id-challenge3', {digits: '612'});

    checkEndPoint('/id-challenge4');
    checkEndPoint('/id-challenge4', {digits: '99999'});
    checkEndPoint('/id-challenge4', {digits: '97648'});

    checkEndPoint('/id-name-no-response');
    checkEndPoint('/id-challenge-wrong');
});

describe('victory', function() {
    checkEndPoint('/victory1');
    checkEndPoint('/victory2');
});