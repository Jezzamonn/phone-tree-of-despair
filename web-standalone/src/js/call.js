const { ActionList } = require('../../../model/action-list.js');
const { getResponse } = require('./responses.js');

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

class Call {
    constructor() {
        this.actionQueue = [];

        this.getDigitsAction = null;
        this.currentDigits = '';

        /** @type {SpeechRecognition} */
        this.speechRecognition = null;

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
        this.cleanUpGetDigits();
        this.cleanUpGetSpeech();
        this.actionQueue = [];
    }

    cleanUpGetDigits() {
        this.getDigitsAction = null;
        this.currentDigits = '';
    }

    cleanUpGetSpeech() {
        if (this.speechRecognition == null) {
            return;
        }
        this.speechRecognition.onresult = null;
        this.speechRecognition.abort();
        this.speechRecognition = null;
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

    /**
     * Inserts actions to the start of the queue that handle either getting
     * speech or getting digits, while doing other actions at the same time.
     */
    insertGatherActions(whileWaiting, timeout) {
        if (whileWaiting == null) {
            whileWaiting = new ActionList();
        }
        // A little dodge, but we're inserting some extra actions of our own.
        this.actionQueue.unshift(
            ...whileWaiting.actions,
            {type: 'pause', length: timeout},
            {type: 'endGather'});
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

                this.insertGatherActions(action.whileWaiting, action.timeout);
                this.nextAction();
                break;
            }
            case 'getSpeech': {
                // Because the speech recognition doesn't filter out currently
                // playing audio, we can't play speech at the same time. So we
                // take the while waiting actions and do them first, and then
                // postpone speech recognition until after by using a new
                // command.
                let whileWaitingActions = [];
                if (action.whileWaiting) {
                    whileWaitingActions = action.whileWaiting.actions;
                }
                let timeout = action.timeout;

                // Remove the last pause, as we want to start getting speech results straight away.
                while (whileWaitingActions.length > 0 &&
                       whileWaitingActions[whileWaitingActions.length-1].type == 'pause') {
                    let pauseAction = whileWaitingActions.pop();
                    timeout += pauseAction.length;
                }

                this.actionQueue.unshift(
                    ...whileWaitingActions,
                    {type: 'startSpeechRecognition', responseDestination: action.responseDestination},
                    {type: 'pause', length: timeout},
                    {type: 'endGather'});
                this.nextAction();
                break;
            }
            case 'startSpeechRecognition': {
                // Handle speech recognition, now we've done the while waiting
                // actions.
                if (this.speechRecognition != null) {
                    console.error('We already have a speechRecognition. Should just be one.');
                }

                console.log('Starting speech recognition');

                // TODO: Use the hints somehow.
                const speechRec = new SpeechRecognition();
                speechRec.lang = 'en'; // I wonder what it assumes for the region.

                speechRec.onresult = (evt) => {
                    if (evt.results == null || evt.results.length == 0 || evt.results[0].length == 0) {
                        console.warn('Finished getting speech, but null result!');
                        return;
                    }
                    const result = evt.results[0];
                    const chosenAlternative = result[0];

                    console.log(`Got speech: ${chosenAlternative.transcript} + confidence: ${chosenAlternative.confidence.toFixed(2)}`)

                    this.setAction(
                        action.responseDestination,
                        {speech: chosenAlternative.transcript.toLowerCase()}
                    );
                }
                speechRec.start();
                this.speechRecognition = speechRec;
                this.nextAction();
                break;
            }
            case 'redirect': {
                this.setAction(action.destination);
                break;
            }
            case 'pause': {
                const handle = setTimeout(() => this.nextAction(), action.length * 1000);

                this.cleanUpLastAction = () => {
                    clearTimeout(handle);
                }
                break;
            }
            case 'endGather': {
                this.cleanUpGetDigits();
                this.cleanUpGetSpeech();
                this.nextAction();
                break;
            }
            case 'end': {
                this.end();
                break;
            }
            case 'say':
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