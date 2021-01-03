const { ActionList } = require('../model/action-list');

function victory1() {
    return new ActionList()
        .play('victory/victory-intro.mp3')
        .play('victory/victory-ending1.mp3')
        .play('victory/victory-goodbye.mp3');
}

function victory2() {
    return new ActionList()
        .play('victory/victory-intro.mp3')
        .play('victory/victory-ending2.mp3')
        .play('victory/victory-goodbye.mp3');
}

module.exports = {
    victory1,
    victory2,
};