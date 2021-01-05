const { ActionList } = require('../../../model/action-list.js');
const { getResponse } = require('./responses.js');

class Call {
    constructor() {
        // Array of {actionList, actionIndex} objects. Last one is the top of the stack.
        // The whole stack is replaced when redirecting.
        /** @type {!Array<{actionList: !ActionList, actionIndex: number}} */
        this.actionStack = [];

        /** @type {HTMLAudioElement} */
        this.currentAudio = null;

        this.getDigitsAction = null;
        this.currentDigits = '';

        this.onEnd = () => {};
    }

    isActive() {
        return this.actionStack.length > 0;
    }

    start() {
        this.setAction('/entry');
    }

    end() {
        if (this.currentAudio) {
            // Stops the sound.
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        this.actionStack = [];
        this.getDigitsAction = null;

        this.onEnd();
    }

    addDigit(digit) {
        if (this.getDigitsAction == null) {
            return;
        }
        this.currentDigits += digit;
        console.log(`currentDigits = ${this.currentDigits}`);
        if (this.currentDigits.length == this.getDigitsAction.numDigits) {
            const dest = this.getDigitsAction.responseDestination;
            this.getDigitsAction = null;
            this.setAction(dest);
        }
    }

    setAction(path) {
        console.log(`action: ${path}`);
        const actionList = getResponse(path);
        this.actionStack = [{
            actionList,
            actionIndex: -1,
        }]

        this.nextAction();
    }

    nextAction() {
        if (!this.isActive()) {
            return;
        }

        // Reset stuff
        if (this.currentAudio) {
            this.currentAudio.onended = null;
            this.currentAudio = null;
        }

        let actionInfo;
        while (true) {
            actionInfo = this.actionStack[this.actionStack.length-1];
            actionInfo.actionIndex++;
            if (actionInfo.actionIndex < actionInfo.actionList.actions.length) {
                break;
            }

            // Reached the end of the action list, try pop out to the other one
            this.actionStack.pop();

            // Check if we're in the middle of gathering something.
            // If so, wait for the timeout.
            if (this.getDigitsAction != null) {
                setTimeout(() => {
                    this.getDigitsAction = null;
                    this.nextAction();
                }, this.getDigitsAction.timeout);
                return;
            }

            if (this.actionStack.length == 0) {
                this.end();
                return;
            }
        }

        const {actionList, actionIndex} = actionInfo;
        const action = actionList.actions[actionIndex];

        console.log(`action ${actionIndex}: ${action.type}`);
        switch (action.type) {
            case 'say':
                // Can't do this. :(
                // Just log it and delay
                console.log(`say: ${action.text}`);
                setTimeout(() => this.nextAction(), 5000);
                break;
            case 'play':
                const basePath = 'static/'
                const fullPath = basePath + action.soundPath;

                this.currentAudio = new Audio(fullPath);
                this.currentAudio.onended = () => this.nextAction();
                this.currentAudio.play();
                break;
            case 'getSpeech':
                // skip
                this.nextAction();
                break;
            case 'getDigits':
                if (this.getDigitsAction != null) {
                    console.error('We already have a getDigitsAction. Should just be one.');
                }
                this.currentDigits = '';
                this.getDigitsAction = action;
                // Timeout happens AFTER the while waiting list is exhausted.
                let whileWaiting = action.whileWaiting;
                if (whileWaiting == null) {
                    whileWaiting = new ActionList();
                }

                this.actionStack.push({
                    actionList: action.whileWaiting,
                    actionIndex: -1,
                });
                this.nextAction();
                break;
            case 'redirect':
                this.setAction(action.destination);
                break;
            case 'pause':
                setTimeout(() => this.nextAction(), 1000);
                break;
        }
    }
}

module.exports = {
    Call,
}