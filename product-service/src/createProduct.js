import {corsHeaders, isProductValid} from "./common";
import {invoke, QUERIES} from "./db";


export const createProduct = async (event) => {
    console.log(`CREATE PRODUCT event body: ${event.body}`);
    const client = await invoke()
    try {
        const { title, description, price, count } = JSON.parse(event.body);

        const newProduct = {
            title,
            description,
            price,
            count,
        }

        if (!isProductValid(newProduct)) {
            console.error(`CREATE PRODUCT error - product is not valid: ${JSON.stringify(newProduct)}`)
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    statusCode: 400,
                    message: 'Invalid product'
                })
            }
        }
        await client.query('BEGIN');
        const product = await client.query(QUERIES.CREATE_PRODUCT, [title, description, price])
        const id = product.rows[0].id;
        console.log(`Created id is ${id}; created product is ${JSON.stringify(product)}`)


        await client.query(QUERIES.CREATE_STOCK, [count, id]);
        await client.query('COMMIT');

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
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 201,
                message: `Product with id ${id} was created`
            })
        };

    } catch (e) {
        await client.query('ROLLBACK');
        console.error(`CREATE PRODUCT error: ${e}`)
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