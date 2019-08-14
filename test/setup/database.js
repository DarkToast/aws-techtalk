const {dockerComposeTool} = require('docker-compose-mocha');
const AWS = require('aws-sdk');

// Setup docker environment.
let endpoint = 'http://amazon-dynamodb-local:8000';

if (process.env.CI === undefined) {
    console.log('We\'re on a local system. Starting dynamo docker container.');
    const pathToCompose = './docker-compose.yml';
    dockerComposeTool(before, after, pathToCompose, {startOnlyTheseServices: ['database']});

    endpoint = 'http://localhost:8000';
}

// Setup dynamo database
AWS.config.update({
    region: 'eu-central-1',
    endpoint: endpoint
});

const keyStoreTableName = 'KeyStoreTable';
process.env.KEY_STORE_REF = keyStoreTableName;

let dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

// For each test: Create the dynamo db tables
beforeEach(async function () {
    console.log('Creating Dynamo tables');
    await createKeyStoreTable();
    console.log('Finished creating tables');
});

let createKeyStoreTable = async function createDnaTable() {
    console.log('Creating %s table', keyStoreTableName);
    let table = {
        TableName: keyStoreTableName,
        AttributeDefinitions: [
            {
                AttributeName: 'key',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'key',
                KeyType: 'HASH'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
    };

    await dynamodb.createTable(table).promise();
};

// After each test: Delete the dynamo db table.
afterEach(async function () {
    console.log('Deleting all dynamo db tables');
    await dynamodb.deleteTable({TableName: keyStoreTableName}).promise();
    console.log('Finished deleting all tables');
});

module.exports = {
    dynamodb,
    keyStoreTableName
};