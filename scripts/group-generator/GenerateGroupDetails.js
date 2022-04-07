
const dataResource = require('./resources/data');
const config = require('config');
const MAX_OFFICIAL_GROUP_SIZE = config.get('groupSizeLimit.maxOfficialGroupSize');

const generateGroupsWithDetails = async(groupName) => await dataResource.generateGroupSubscribers(MAX_OFFICIAL_GROUP_SIZE, groupName);

module.exports = {
    generateGroupsWithDetails,
};
