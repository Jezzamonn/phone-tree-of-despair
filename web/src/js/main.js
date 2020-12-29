const { Device } = require("twilio-client");

const API_URL = 'https://stellar-ether-198321.uc.r.appspot.com';

const buttonNames = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '*',
    '0',
    '#',
    'call',
];

const device = new Device();
let token = null;
let hasSetUpDevice = false;
let deviceIsReady = false;

let connection = null;
let enteredNumbers = '';

function hasActiveCall() {
    return connection != null;
}

function isReadyForCall() {
    return token != null;
}

function init() {
    updateUI();
}

// Not that efficient to run, but efficient to implement ;)
function updateUI() {
    document.querySelector('.entered-numbers').innerText = enteredNumbers;

    const hasCall = hasActiveCall();
    const callButton = document.querySelector('.numpad-call')

    callButton.disabled = !isReadyForCall();
    callButton.classList.toggle(
        'numpad-call__in-call',
        hasCall,
    );

    // Numbers... and also * and #.
    const numberButtons = document.querySelectorAll('.numpad-element:not(.numpad-call)');
    for (const button of numberButtons) {
        // You can only press the buttons if you're in the middle of a call.
        button.disabled = !hasCall;
    }
}

window.onload = init;