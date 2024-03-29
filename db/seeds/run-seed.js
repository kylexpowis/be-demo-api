const data = require('../data');
const seed = require('../seeds/seed');
const db = require('../connection');

const runSeed = () => {
    return seed(data).then(() => db.end());
};

runSeed();