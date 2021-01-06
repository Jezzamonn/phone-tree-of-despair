const { ActionList } = require('../model/action-list');

function address() {
    return new ActionList()
        .getSpeech({
            responseDestination: '/address-can-wait',
            hints: ['yes', 'no'],
            timeout: 3,
            whileWaiting: new ActionList()
                .play('addressing/addressing-intro.mp3')
                .pause(),
        })
        //.say(`Hi, this is the addressing office. I'm currently on lunch break actually, is this something that can wait?`)
        .redirect('/address-can-wait');
};

function addressCanWait({speech=''}={}) {
    if (!speech.startsWith('n') && !speech.includes('no')) {
        return new ActionList()
            // .say(`Ok great. I'll put you on hold.`)
            .play('addressing/addressing-can-wait.mp3')
            .hold();
    }

    return new ActionList()
        .getSpeech({
            responseDestination: '/address-clue1',
            hints: ['coffee'],
            timeout: 3,
            whileWaiting: new ActionList()
                // .say(`No? Ok, well, I'm almost done with this crossword. If you could help me with the last few clues, then I should be able to help you with your problem.`)
                .play('addressing/addressing-cant-wait.mp3')
                // .say(`Alright, let's see... 16 Down. A 6 letter word for "coffee", starts with a C.`);
                .play('addressing/addressing-coffee-hint.mp3')
                .pause(),
        })
        .redirect('/address-clue-too-long');
};

function addressClue1({speech=''}={}) {
    if (!speech.includes('coffee')) {
        return addressClueWrong();
    }

    return new ActionList()
        .getSpeech({
            responseDestination: '/address-clue3',
            hints: ['oxygen'],
            timeout: 3,
            whileWaiting: new ActionList()
                .play('addressing/addressing-oxygen-hint.mp3')
                .pause(),
        })
        .redirect('/address-clue-too-long');
};

function addressClue3({speech=''}={}) {
    if (!speech.includes('oxygen')) {
        return addressClueWrong();
    }

    return new ActionList()
        .getSpeech({
            responseDestination: '/address-clue4',
            hints: ['silent'],
            timeout: 3,
            whileWaiting: new ActionList()
                // .say(`Oxygen fits! Ok, last one: 1 Across. Another word for quiet. 6 letters long, the second letter is 'I' and the third letter is 'L'.`);
                .play('addressing/addressing-silent-hint.mp3')
                .pause(),
        })
        .redirect('/address-clue-too-long');
};

function addressClue4({speech=''}={}) {
    if (!speech.includes('silent')) {
        return addressClueWrong();
    }

    return new ActionList()
        // .say(`Silent! Of course! Ok, that's all of them! Now, lets take a look at your problem.`);
        // .pause();
        // .say(`Hm... Oh, are you trying to find the address of your registration office? We don't do that here. This is the addressing office, for writing names and addresses on envelopes. If you want the find the address of your registration office, you'll need to call Sam on the extension 828.`)
        // .say(`Alright, well thanks for your help with the crossword! Have a nice day.`);
        .play('addressing/addressing-correct.mp3');
};

// Not exported
function addressClueWrong() {
    return new ActionList()
        // .say(`Hm, no, that's not it. Let me put you on hold while I think about it.`);
        .play('addressing/addressing-clue-wrong.mp3')
        .hold()
}

function addressClueTooLong() {
    return new ActionList()
        // .say(`Not sure? Yeah me neither. Let me put you on hold while I think about it.`);
        .play('addressing/addressing-too-long.mp3')
        .hold();
}

module.exports = {
    address,
    addressCanWait,
    addressClue1,
    addressClue3,
    addressClue4,
    addressClueTooLong,
}