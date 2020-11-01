import products from './mocks/products.json';
import { prop, find } from 'lodash/fp';

export const getProductById = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const productId = prop('pathParameters.productId', event);
        const product = find(['id', productId], products)
        console.log(`Provided productId is ${productId}; found product is ${product}`)

        if (!product) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Product not found'
                })
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error'
            })
        }
    }
};