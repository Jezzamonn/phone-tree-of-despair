/**
 * @param {Request} request
 */
function getRegistrationId(request) {
    // TODO: Use request.body.From in the rng.
    return '12345';
}

/**
 * @param {Request} request
 */
function getRegistrationPostalCode(request) {
    return '12345';
}

/**
 * @param {Request} request
 */
function getRegistrationDate(request) {
    return '20191126';
}


// These functions come from the util.js file in my usual JavaScript starter project:
// https://github.com/Jezzamonn/es6-base/blob/master/src/js/util.js

// Pseudo-random number generator functions
// From stack overflow: https://stackoverflow.com/a/47593316
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

// Just using a simple 32-bit random number generator, our numbers don't need to be too random.
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * @param {string} seed What ya seed it with.
 * @returns {function():number} A wonderful seeded random number generator.
 */
function seededRandom(seed) {
    const seedFn = xmur3(seed);
    return mulberry32(seedFn());
}

module.exports = {
    getRegistrationId,
    getRegistrationDate,
    getRegistrationPostalCode,
};
