const { Call } = require('./call.js');

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

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

function getButtonSfxName(name) {
    switch (name) {
        case 'call':
            return '';
        case '*':
            return 'star.mp3';
        case '#':
            return 'hash.mp3';
        default:
            return `${name}.mp3`;
    }
}

let enteredNumbers = '';

let call = new Call();
call.onEnd = () => {
    updateUI();

    const audio = new Audio('static/sfx/hang-up.mp3');
    audio.play();
}

function hasActiveCall() {
    return call.isActive();
}

function isReadyForCall() {
    return (SpeechRecognition != null);
}

function init() {
    const buttons = document.querySelectorAll('.numpad-element');
    for (const [i, button] of buttons.entries()) {
        const name = buttonNames[i];
        const sfxName = getButtonSfxName(name);
        button.addEventListener('click', () => handleButtonPress(name));
        button.addEventListener('mousedown', () => {
            if (name == 'call') {
                return;
            }
            const audio = new Audio(`static/sfx/${sfxName}`);
            audio.play();
        });
    }

    updateUI();
}


function handleButtonPress(code) {
    console.log(code);

    if (!isReadyForCall()) {
        return;
    }

    if (code == 'call') {
        // In a call.
        if (hasActiveCall()) {
            endCall();
        }
        else {
            startCall();
        }
    }
    else {
        if (!hasActiveCall()) {
            return;
        }

        sendDigit(code);

        enteredNumbers += code;
    }

    updateUI();
}

function startCall() {
    call.start();
    enteredNumbers = '';
}

function endCall() {
    call.end();
}

function sendDigit(code) {
    call.addDigit(code);
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

    const unavailableMessage = document.querySelector('.unavailable-message');
    const isSpeechRecognitionSupported = SpeechRecognition != null;
    unavailableMessage.classList.toggle('hidden', isSpeechRecognitionSupported);
}

window.onload = init;