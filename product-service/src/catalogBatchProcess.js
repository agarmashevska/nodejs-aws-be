import AWS from 'aws-sdk'
import { filter } from 'lodash/fp'
import {invoke, QUERIES} from "./db";
import {corsHeaders, isProductValid} from "./common";

export const catalogBatchProcess = async (event) => {
    console.log(`CatalogBatchProcess event: ${JSON.stringify(event.Records)}`);
    const client = await invoke()
    const sns = new AWS.SNS({ region: 'eu-west-1' });
    const rawProducts = event.Records.map(({ body }) => JSON.parse(body));
    console.log(`CatalogBatchProcess products: ${JSON.stringify(products)}`)
    const products = filter(isProductValid, rawProducts)

    try {
        if (!products.length) {
            console.error(`CatalogBatchProcess error: products are empty`)
            throw new Error('Products are empty')
        }

        const promiseAllSettledResult = await Promise.allSettled(products.map(async (product) => {
            try {
                await client.query('BEGIN');
                const { title, description, price, count } = product
                const createdProduct = await client.query(QUERIES.CREATE_PRODUCT, [title, description, price])
                const id = createdProduct.rows[0].id;
                console.log(`CatalogBatchProcess: inserted product id is ${id}; product - ${JSON.stringify(createdProduct)}`)
                await client.query(QUERIES.CREATE_STOCK, [count, id]);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(`CatalogBatchProcess: product was not inserted ${JSON.stringify(product)}, Error: ${error.message}`)
                throw error
            }
        }))

        const rejected = filter(['status', 'rejected'], promiseAllSettledResult)
        const fulfilled = filter(['status', 'fulfilled'], promiseAllSettledResult)

        if (rejected.length) {
            console.log(`CatalogBatchProcess: Products saved partially: saved in total - ${products.length - rejected.length} out of ${products.length}`)
        }

        if (!fulfilled.length) {
            throw new Error('Records were not inserted')
        }

        await sns.publish({
            Subject: "Products were inserted",
            Message: `Total products amount that were uploaded ${fulfilled.length}`,
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
                total: {
                    DataType: "Number",
                    StringValue: fulfilled.length.toString(),
                }
            },
        }).promise();


    } catch (e) {
        console.error(`catalogBatchProcess: ${e.message}`)
    } finally {
        client.end();
    }
}