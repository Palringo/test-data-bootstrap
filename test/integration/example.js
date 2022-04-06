
// 3rd party dependecies
const httpStatus = require('http-status-codes');
const testRequest = require('supertest');
const { expect } = require('chai');

// Local dependencies
const dataResource = require('../resource/data');
const swagger = require('../../api/swagger/swagger');

// Variables
let app;

describe('Has Group Read Permission', () => {
    before(async () => {
        app = await swagger.init();

        await amqp.connect();
        await amqp.createExchange(groupExchange.name, groupExchange.type);
        await amqp.createAndBindQueue(queue.name, groupExchange.name, queue.routingKey);
        await amqp.disconnect();
    });

    after(async () => {
        app.close();
    });

    beforeEach(async() => {
        await amqp.connect();
    });

    afterEach(async () => {
        await dataResource.cleanupData();
        await amqp.disconnect();
    });

    describe('when the group does not exist', () => {
        it('should return internal server error', async() => {
            const groupId = 33;
            const requesterId = 44;

            await dataResource.insertSubscriber(requesterId);

            const response = await testRequest(app)
                .get(`/group/${groupId}/readPermission`)
                .set('Content-Type', 'application/json')
                .set('Palringo-RequesterId', requesterId)
                .expect(httpStatus.INTERNAL_SERVER_ERROR);
            
            expect(response, 'response').to.have.all.keys('code');
        });
    });

});
