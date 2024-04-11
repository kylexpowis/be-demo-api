const db = require("../db/connection");

exports.checkDatabaseConnection = function () {
    return new Promise((resolve, reject) => {
        db.query('SELECT 1')
            .then(({ error }) => {
                if (error) {
                    reject(new Error('Database connection unhealthy'));
                } else {
                    resolve();
                }
            })
            .catch(error => reject(new Error('Database health check failed: ' + error.message)));
    });
};
