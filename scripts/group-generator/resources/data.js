
// 3rd party dependecies
const config = require('config');

// Palringo dependencies
const { DbPool } = require('@palringo/db').mysql;

// Local dependencies
const sqlResource = require('./sql');

// Variables
const dbSetupCfg = config.get('dbSetup');
const dbPool = new DbPool(dbSetupCfg);

const generateGroupSubscribers = async(groupSize, groupName) => await dbPool.executeQuery(sqlResource.dropGenerateGroupSubscribersProcedure)
    .then(async() => await dbPool.executeQuery(sqlResource.createGenerateGroupSubscribersProcedure))
    .then(async() => await dbPool.executeQuery(sqlResource.callGenerateGroupSubscribersProcedure, [groupSize, groupName]))
    .then(async() => (await dbPool.executeQuery(sqlResource.selectGroupId))[0].groupId)
    .then(async(groupId) => {
        await dbPool.executeQuery(sqlResource.dropGenerateGroupSubscribersProcedure);
        return groupId;
    });
module.exports = {
    generateGroupSubscribers,
};
