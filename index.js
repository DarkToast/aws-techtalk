const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const awsDynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const KeyStoreDatabase = require('./src/key-store-db');
const keyStoreDb = KeyStoreDatabase(awsDynamoDb, process.env.KEY_STORE_REF);

async function handlePut(event, context) {
    console.log(`Got event for handlePut: ${JSON.stringify(event)}`);

    await keyStoreDb.save(event);

    return {
        statusCode: 200
    }
}

async function handleGet(event, context) {
    console.log(`Got event for handleGet: ${JSON.stringify(event)}`);

    let result = await keyStoreDb.load(event.key);

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

module.exports = {
    handleGet,
    handlePut
};