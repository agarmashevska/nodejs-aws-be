import { prop } from 'lodash/fp';
import {corsHeaders} from "./common";
import {invoke, QUERIES} from "./db";

export const getProductById = async (event) => {
    console.log(`GET PRODUCT BY ID event: ${event}`);
    const client = await invoke()
    try {
        const productId = prop('pathParameters.productId', event);

        const product = await client.query(QUERIES.GET_PRODUCT_BY_ID, [productId])
        console.log(`Provided productId is ${productId}; found product is ${JSON.stringify(product)}`)

        if (!product.rows.length) {
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
            body: JSON.stringify(product.rows[0])
        };

    } catch (e) {
        console.error(`PRODUCT GET BY ID error: ${e}`)
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 500,
                message: 'Internal Server Error'
            })
        }
    } finally {
        client.end();
    }
};