const { ActionList } = require('../model/action-list');

function entry() {
    return new ActionList()
        .getDigits({
            responseDestination: '/check-extension',
            numDigits: 3,
            timeout: 5,
            whileWaiting: new ActionList()
                .say('Thank you for calling the Phone Tree of Despair. Your call is so, so, important to us.')
                .pause()
                .say('If you have an extension code, enter it now. ' + 'Otherwise, stay on the line for more information.'),
        })
        .redirect('/more-info');
}

module.exports = {
    entry
};