const { ActionList } = require('../model/action-list');

function directory() {
    return new ActionList()
        .play('directory/directory.mp3')
        .pause()
        .redirect('/entry');
};

module.exports = {
    directory,
}