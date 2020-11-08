import products from './mocks/products.json';
import { prop, find } from 'lodash/fp';
import {corsHeaders} from "./common";

export const getProductById = async (event) => {
    console.log('Lambda invocation with event: ', event);

    try {
        const productId = prop('pathParameters.productId', event);
        const product = find(['id', productId], products)
        console.log(`Provided productId is ${productId}; found product is ${JSON.stringify(product)}`)

        if (!product) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    statusCode: 404,
                    message: 'Product not found'
                })
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(product)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 500,
                message: 'Internal Server Error'
            })
        }
    }
};