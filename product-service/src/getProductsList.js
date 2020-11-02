import productsList from './mocks/products.json'
import { corsHeaders } from './common'

const products = productsList || []

export const getProductsList = async (event) => {
    try {
        if (!products.length) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    statusCode: 404,
                    message: 'Products are empty'
                })
            };
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(products)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 500,
                message: 'Internal Server Error'
            })
        };
    }
};