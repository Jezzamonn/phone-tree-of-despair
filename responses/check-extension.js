const { ActionList } = require('../model/action-list');

function checkExtension({digits=''}={}) {
    // If the user entered digits, process their request
    switch (digits) {
        case '111':
            return new ActionList()
                .redirect('/registration');
        case '123':
            return new ActionList()
                .redirect('/directory');
        case '575':
            return new ActionList()
                .redirect('/id');
        case '818':
            return new ActionList()
                .redirect('/address');
        case '828':
            return new ActionList()
                .redirect('/office-address');

        // Noise / datetime section
        case '303':
            return new ActionList()
                .play('noise/dtmf.mp3');
        case '313':
            return new ActionList()
                .play('noise/mumbling.mp3');
        case '323':
            return new ActionList()
                .play('noise/oof.mp3');
        case '333':
            return new ActionList()
                .play('noise/hello.mp3');
        case '343':
            return new ActionList()
                .play('noise/traffic.mp3');
        case '353':
            return new ActionList()
                .redirect('/datetime');
        case '363':
            return new ActionList()
                .play('noise/wahwahnoise.mp3');
        case '373':
            return new ActionList()
                .play('noise/mumbling-distorted.mp3');
        case '383':
            return new ActionList()
                .play('noise/crinkling.mp3');
        case '393':
            return new ActionList()
                .play('noise/chickensound.mp3');
        case '364':
            return new ActionList()
                // .say("That's Bob's office");
                .play('check-extension/thats-bobs-office.mp3');
        default:
            return new ActionList()
                // .say("Sorry, that's not a valid response. Please hold.")
                .play('check-extension/sorry-thats-not-a-valid-response.mp3')
                .hold();
    }
};

module.exports = {
    checkExtension
};
