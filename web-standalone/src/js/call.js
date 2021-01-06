const { ActionList } = require('../../../model/action-list.js');
const { getResponse } = require('./responses.js');

class Call {
    constructor() {
        this.actionQueue = [];

        this.getDigitsAction = null;
        this.currentDigits = '';

        // Function that when called, will clean up everthing that needs to be cleaned up for this action.
        this.cleanUpLastAction = () => {};

        this.onEnd = () => {};
    }

    isActive() {
        return this.actionQueue.length > 0;
    }

    start() {
        this.setAction('/entry');
    }

    end() {
        this.cleanUpActionQueue();

        this.onEnd();
    }

    cleanUpActionQueue() {
        this.cleanUpLastAction();
        this.actionQueue = [];
        this.getDigitsAction = null;
        this.currentDigits = '';
    }

    addDigit(digit) {
        if (this.getDigitsAction == null) {
            return;
        }
        this.currentDigits += digit;
        console.log(`currentDigits = ${this.currentDigits}`);

        if (this.currentDigits.length == this.getDigitsAction.numDigits) {
            this.setAction(
                this.getDigitsAction.responseDestination,
                {digits: this.currentDigits}
            );
        }
    }

    setAction(path, {digits='', speech=''}={}) {
        this.cleanUpActionQueue();

        console.log(`action: ${path}, digits=${digits}, speech=${speech}`);
        this.actionQueue = getResponse(path, {digits, speech}).actions;
        this.actionQueue.push({type: 'end'});

        this.nextAction();
    }

    nextAction() {
        if (!this.isActive()) {
            return;
        }

        this.cleanUpLastAction();
        this.cleanUpLastAction = () => {};

        const action = this.actionQueue.shift();

        console.log(`action ${action.type}`);
        switch (action.type) {
            case 'say': {
                // Can't do this on my computer because the voice synths are broken.
                // So just log it and delay
                console.log(`say: ${action.text}`);
                const handle = setTimeout(() => this.nextAction(), 5000);

                this.cleanUpLastAction = () => {
                    clearTimeout(handle);
                }
                break;
            }
            case 'play': {
                const basePath = 'static/'
                const fullPath = basePath + action.soundPath;

                const audio = new Audio(fullPath);
                audio.onended = () => this.nextAction();
                audio.play();

                this.cleanUpLastAction = () => {
                    audio.onended = null;
                    audio.pause();
                }
                break;
            }
            case 'getDigits': {
                if (this.getDigitsAction != null) {
                    console.error('We already have a getDigitsAction. Should just be one.');
                }
                this.currentDigits = '';
                this.getDigitsAction = action;

                let whileWaiting = action.whileWaiting;
                if (whileWaiting == null) {
                    whileWaiting = new ActionList();
                }
                // A little dodge, but we're inserting some extra actions of our own.
                this.actionQueue.unshift(
                    ...whileWaiting.actions,
                    {type: 'pause', length: action.timeout},
                    {type: 'endGather'});

                this.nextAction();
                break;
            }
            case 'redirect': {
                this.setAction(action.destination);
                break;
            }
            case 'pause': {
                const handle = setTimeout(() => this.nextAction(), 1000);

                this.cleanUpLastAction = () => {
                    clearTimeout(handle);
                }
                break;
            }
            case 'endGather': {
                this.getDigitsAction = null;
                this.nextAction();
                break;
            }
            case 'end': {
                this.end();
                break;
            }
            default: {
                // Skip.
                this.nextAction();
            }
        }
    }
}

module.exports = {
    Call,
}