class ActionList {
    constructor() {
        this.actions = [];
    }

    say(text, {voice=''}={}) {
        this.actions.push(new SayAction(text, {voice}));
        return this;
    }

    play(soundPath) {
        this.actions.push(new PlayAction(soundPath));
        return this;
    }

    hold() {
        this.actions.push(new PlayAction('please-hold-mangled.mp3'));
        return this;
    }

    getSpeech({
        responseDestination,
        hints,
        timeout,
        whileWaiting
    }) {
        this.actions.push(new GetSpeechAction({
            responseDestination,
            hints,
            timeout,
            whileWaiting
        }));
        return this;
    }

    getDigits({
        responseDestination,
        numDigits,
        timeout,
        whileWaiting
    }) {
        this.actions.push(new GetDigitsAction({
            responseDestination,
            numDigits,
            timeout,
            whileWaiting
        }));
        return this;
    }

    redirect(destination) {
        this.actions.push(new RedirectAction(destination));
        return this;
    }

    pause({length=1}={}) {
        this.actions.push(new PauseAction({length}));
        return this;
    }
}

class SayAction {
    constructor(text, {voice}) {
        this.type = 'say';
        this.text = text;
        this.voice = voice;
    }
}

class PlayAction {
    constructor(soundPath) {
        this.type = 'play'
        this.soundPath = soundPath;
    }
}

class GetDigitsAction {
    constructor({
        responseDestination,
        numDigits,
        timeout,
        whileWaiting
    }) {
        this.type = 'getDigits';
        this.responseDestination = responseDestination;
        this.numDigits = numDigits;
        this.timeout = timeout;
        this.whileWaiting = whileWaiting;
    }
}

class GetSpeechAction {
    constructor({
        responseDestination,
        hints,
        timeout,
        whileWaiting
    }) {
        this.type = 'getSpeech';
        this.responseDestination = responseDestination;
        this.hints = hints;
        this.timeout = timeout;
        this.whileWaiting = whileWaiting;
    }
}

class RedirectAction {
    constructor(destination) {
        this.type = 'redirect';
        this.destination = destination;
    }
}

class PauseAction {
    constructor({length}) {
        this.type = 'pause';
        this.length = length;
    }
}

module.exports = {
    ActionList
}