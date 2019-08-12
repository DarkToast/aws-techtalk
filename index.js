async function handlePut(event, context) {
    console.log(`Got event for handlePut: ${JSON.stringify(event)}`);
    return {
        statusCode: 200
    }
}

async function handleGet(event, context) {
    console.log(`Got event for handleGet: ${JSON.stringify(event)}`);
    return {
        statusCode: 200
    }
}

module.exports = {
    handleGet,
    handlePut
};