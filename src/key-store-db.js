let KeyStoreDb = function KeyStoreDb(dynamoDb, tableName) {

    let load = async function load(key) {
        const params = {
            TableName: tableName,
            Key: {
                key: {S: key}
            }
        };

        return dynamoDb.getItem(params).promise()
            .then(data => {
                if (data.Item) {
                    console.log('Loaded item from database!');

                    return {
                        key: data.Item.key.S,
                        value: data.Item.value.S
                    };
                }

                console.log(`Item with the key ${key} does not exist in the database`);
            });
    };

    let save = async (item) => {
        let params = {
            TableName: tableName,
            Item: {
                key: {S: item.key},
                value: {S: item.value}
            }
        };

        return dynamoDb.putItem(params).promise()
            .then(function() {
                console.log('Saved item to database.');
            });
    };

    return {
        load,
        save
    };
};

module.exports = KeyStoreDb;