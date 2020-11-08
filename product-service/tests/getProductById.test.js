import { corsHeaders } from '../src/common'

describe('getProductById', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    test('should return product by id if product exists', async () => {
       jest.setMock('../src/mocks/products.json', [
            {
                id: 'someId',
                foo: 'bar',
            }
        ]);
        const event = {
            pathParameters: {
                productId: 'someId'
            }
        }
        const result = await require('..').getProductById(event)

        expect(result).toEqual({
            body: JSON.stringify({
                id: 'someId',
                foo: 'bar',
            }),
            headers: corsHeaders,
            statusCode: 200
        })

    })

    test('should return proper message and 404 status code if product does not exists', async () => {
       jest.setMock('../src/mocks/products.json', [
            {
                id: 'someOtherId',
                foo: 'bar',
            }
        ]);
        const event = {
            pathParameters: {
                productId: 'someId'
            }
        }
        const result = await require('..').getProductById(event)

        expect(result).toEqual({
            body: JSON.stringify({
                statusCode: 404,
                message: 'Product not found',
            }),
            headers: corsHeaders,
            statusCode: 404
        })
    })
})