const { Device } = require("twilio-client");

const API_URL = 'http://localhost:3000';

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
    const buttons = document.querySelectorAll('.numpad-element');
    for (const [i, button] of buttons.entries()) {
        button.addEventListener('click', () => handleButtonPress(buttonNames[i]));
    }

    updateUI();
    getAuthToken();
}

function getAuthToken() {
    fetch(`${API_URL}/token`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            token = data['token'];
            updateUI();
        });
}

function setUpDevice() {
    if (hasSetUpDevice) {
        return;
    }
    // Need a token to do this!
    if (!token) {
        return;
    }

    console.log('Setting up device');

    device.setup(token,
        {
            codecPreferences: ['opus', 'pcmu',],
            fakeLocalDTMF: true,
            debug: true,
        });

    device.on('ready', () => {
        deviceIsReady = true;
        // First click is always on the call button, so just start the call.
        startCall();
        updateUI();
    });
    hasSetUpDevice = true;
}

function handleButtonPress(code) {
    console.log(code);

    setUpDevice();

    if (!deviceIsReady) {
        return;
    }

    if (code == 'call') {
        // In a call.
        if (hasActiveCall() > 0) {
            device.disconnectAll();
            connection = null;
        }
        else {
            startCall();
        }
    }
    else {
        if (!hasActiveCall()) {
            return;
        }

        enteredNumbers += code;
    }

    updateUI();
}

function startCall() {
    connection = device.connect();
    enteredNumbers = '';
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

// Quick hack for debugging.
window.device = device;


window.onload = init;