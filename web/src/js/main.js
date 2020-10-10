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

function init() {
    const buttons = document.querySelectorAll('.numpad-element');
    for (const [i, button] of buttons.entries()) {
        button.addEventListener('click', () => handleButtonPress(buttonOrder[i]));
    }
}

function handleButtonPress(code) {
    console.log(code);

    if (code == 'call') {
        document.querySelector('.numpad-call').classList.toggle('numpad-call__in-call');
    }
}


window.onload = init;