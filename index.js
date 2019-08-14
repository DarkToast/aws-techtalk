const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const awsDynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const KeyStoreDatabase = require('./src/key-store-db');
const keyStoreDb = KeyStoreDatabase(awsDynamoDb, process.env.KEY_STORE_REF);

async function handlePut(event, context) {
    console.log(`Got event for handlePut: ${JSON.stringify(event)}`);
    const body = JSON.parse(event.body);
    const data = {
        key: event.pathParameters.key,
        value: body.value
    };

    await keyStoreDb.save(data);

    return {
        statusCode: 200
    }
}

async function handleGet(event, context) {
    console.log(`Got event for handleGet: ${JSON.stringify(event)}`);
    const key = event.pathParameters.key;
    let result = await keyStoreDb.load(key);

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

module.exports = {
    handleGet,
    handlePut
};