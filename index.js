async function handlePut(event, context) {
    console.log(`Got event for handlePut: ${JSON.stringify(event)}`);
}

async function handleGet(event, context) {
    console.log(`Got event for handleGet: ${JSON.stringify(event)}`);
}

module.exports = {
    handleGet,
    handlePut
};