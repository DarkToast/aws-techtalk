const expect = require('chai').expect;

// Important that this is ABOVE the actual handlers, otherwise the handlers will be created before the databases are mocked.
const {dynamodb, keyStoreTableName} = require('./setup/database');

const {handleGet, handlePut} = require('../index');

const testKey = 'testKey';
const testValue = 'testValue';

describe('Component tests', () => {
    describe('The get handler', () => {
        it('returns status 200', async () => {
            // given: An item exists in the database and an event exists
            await putItem({key: testKey, value: testValue});
            let event = {pathParameters: {key: testKey}};

            // when: The get handler is called
            let result = await handleGet(event);

            // then: The handler returns 200 and the item is found in the result body
            expect(result.statusCode).to.equal(200);

            let resultBody = JSON.parse(result.body);
            expect(resultBody.key).to.equal(testKey);
            expect(resultBody.value).to.equal(testValue);
        });
    });

    describe('The post handler', () => {
        it('returns status 200', async () => {
            // given: A put event exists
            let event = {pathParameters: {key: testKey}, body: `{ "value": "${testValue}" }`};

            // when: The put handler is called
            let result = await handlePut(event);

            // then: The handler returns 200 and the item is found in the database
            expect(result.statusCode).to.equal(200);

            let databaseItem = await getItem(testKey);
            expect(databaseItem.Item.key.S).to.equal(testKey);
            expect(databaseItem.Item.value.S).to.equal(testValue);
        });
    })
});

let putItem = async function putItem(item) {
    const params = {
        TableName: keyStoreTableName,
        Item: {
            key: {S: item.key},
            value: {S: item.value}
        }
    };

    console.log(`Creating key store data in the database '${keyStoreTableName}'`);

    return dynamodb.putItem(params).promise();
};

let getItem = async function getItem(key) {
    let params = {
        Key: {
            key: {S: key}
        },
        TableName: keyStoreTableName
    };

    return dynamodb.getItem(params).promise();
};