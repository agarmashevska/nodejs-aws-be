import { corsHeaders } from './common'
import { invoke, QUERIES } from './db'

export const getProductsList = async (event) => {
    console.log(`GET PRODUCT event: ${event}`)
    const client = await invoke()
    try {
        const products = await client.query(QUERIES.GET_PRODUCTS)

        if (!products.rows.length) {
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
            body: JSON.stringify(products.rows)
        };
    } catch (e) {
        console.error(`GET PRODUCTS error: ${e}`)
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 500,
                message: 'Internal Server Error'
            })
        };
    } finally {
        client.end();
    }
};