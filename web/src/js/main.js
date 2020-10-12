const { Device } = require("twilio-client");

const API_URL = 'http://localhost:3000';

const buttonOrder = [
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

function hasActiveCall() {
    return device.connections.length > 0;
}

function init() {
    const buttons = document.querySelectorAll('.numpad-element');
    for (const [i, button] of buttons.entries()) {
        button.addEventListener('click', () => handleButtonPress(buttonOrder[i]));
    }

    getAuthToken();
}

function getAuthToken() {
    fetch(`${API_URL}/token`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            token = data['token'];
        }).catch((reason) => {
            console.log(reason);
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

    device.on('ready', () => console.log('Ready!'));
    hasSetUpDevice = true;
}

function handleButtonPress(code) {
    console.log(code);

    setUpDevice();

    if (code == 'call') {
        // In a call.
        if (hasActiveCall() > 0) {
            device.disconnectAll();
        }
        else {
            device.connect();
        }

        document.querySelector('.numpad-call').classList.toggle(
            'numpad-call__in-call',
            hasActiveCall(),
        )
    }
}


window.onload = init;