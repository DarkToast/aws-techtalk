const expect = require('chai').expect;
const handleGet = require('../index').handleGet;

describe('The get handler', () => {
   it('returns status 200', async () => {
       const response = await handleGet({foo: 'someEvent'}, null);
       expect(response.statusCode).equals(200);
   });
});