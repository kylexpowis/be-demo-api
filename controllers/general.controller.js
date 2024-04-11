const { checkDatabaseConnection } = require("../models/general.model");

exports.getHealthCheck = (req, res) => {
    res.status(200).send({ status: 'OK' });
};

exports.getDBHealthCheck = (req, res, next) => {
    checkDatabaseConnection() 
        .then(() => {
            res.status(200).send({ status: 'OK' });
        })
        .catch(next); 
};