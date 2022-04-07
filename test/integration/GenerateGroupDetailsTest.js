
// 3rd party dependecies
const { expect } = require('chai');

// Palringo dependencies
const { DbPool } = require('@palringo/db').mysql;

// Local dependencies
const generator = require('../../scripts/group-generator/GenerateGroupDetails');
const config = require('config');
const sqlResource = require('./../resources/sql');
const dataResource = require('../resources/data');

// Variables
const MAX_OFFICIAL_GROUP_SIZE = config.get('groupSizeLimit.maxOfficialGroupSize');
const dbSetupCfg = config.get('dbSetup');
const dbPool = new DbPool(dbSetupCfg);

describe('Generate Group Subscribers', () => {

    afterEach(async() => {
        await dataResource.cleanupData();
    });

    describe('when Generating Group Subscribers', () => {
        it('should generate the same number of configured subscribers', async() => {
            const groupName = 'Testing Group';
            const groupId = await generator.generateGroupsWithDetails(groupName);
            const rs = (await dbPool.executeQuery(sqlResource.countSubscribersByGroup, [groupId]))[0].count;
            expect(rs).to.be.equal(MAX_OFFICIAL_GROUP_SIZE);
        });
    });

});
