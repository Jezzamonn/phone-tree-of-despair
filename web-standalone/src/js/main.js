const { Call } = require('./call.js');

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

let isSpeechApiAvailable = false;

let enteredNumbers = '';

let call = new Call();
call.onEnd = () => updateUI();

function hasActiveCall() {
    return call.isActive();
}

function isReadyForCall() {
    return isSpeechApiAvailable;
}

function init() {
    const buttons = document.querySelectorAll('.numpad-element');
    for (const [i, button] of buttons.entries()) {
        button.addEventListener('click', () => handleButtonPress(buttonNames[i]));
    }

    speechSynthesis.onvoiceschanged = () => {
        setVoices(speechSynthesis.getVoices());
    }
    setVoices(speechSynthesis.getVoices());

    updateUI();
}

function setVoices(voices) {
    if (voices.length == 0) {
        return;
    }
    let femaleVoice = null;
    let maleVoice = null;
    for (const voice of voices) {
        if (voice.name.includes('Female')) {
            femaleVoice = voice;
        }
        if (voice.name.includes('Male')) {
            maleVoice = voice;
        }
    }
    call.setVoices(femaleVoice, {man: maleVoice});

    isSpeechApiAvailable = true;
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
}

window.onload = init;