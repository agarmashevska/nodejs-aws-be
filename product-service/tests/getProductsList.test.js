import { corsHeaders } from '../src/common'

describe('getProductsList', () => {
    beforeEach(() => jest.resetModules());

    test('should return all products', async () => {
        jest.setMock('../src/mocks/products.json', [
            {
                id: 'someId',
                foo: 'bar',
            }
        ]);

        const result = await require('..').getProductsList()

        expect(result).toEqual({
            body: JSON.stringify([{
                id: 'someId',
                foo: 'bar',
            }]),
            headers: corsHeaders,
            statusCode: 200
        })
    })

    test('should return 404 status if products are empty', async () => {
        jest.setMock('../src/mocks/products.json', []);

        const result = await require('..').getProductsList()

        expect(result).toEqual({
            body: JSON.stringify({
                statusCode: 404,
                message: 'Products are empty',
            }),
            headers: corsHeaders,
            statusCode: 404
        })
    })
})