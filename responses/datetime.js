const { ActionList } = require('../model/action-list');

function datetime() {
    return new ActionList()
        .say(`This is the International Date Time Zone Consortium. The datetime of your last renewal, as a Unix Timestamp, is 1 5 7 4. 7 2 6 4. 0 0.`, {voice: 'man'})
        .say(`If you just need the day, it was a Tuesday.`, {voice: 'man'})
        .pause()
        .redirect('/entry');
};

module.exports = {
    datetime,
}