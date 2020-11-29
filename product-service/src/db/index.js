const { Client } = require('pg')

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
}

export const invoke = async () => {
    const client = new Client(dbOptions);
    try {
        await client.connect();
        return client
    } catch (e) {
        client.end();
    }
}

export const QUERIES = {
    GET_PRODUCTS: `
        SELECT id, title, description, price, count FROM products
            INNER JOIN stocks s ON id = s.product_id 
        `,
    GET_PRODUCT_BY_ID: `
        SELECT id, title, description, price, count FROM products p
            INNER JOIN stocks s ON id = s.product_id 
            WHERE p.id = $1
        `,
    CREATE_PRODUCT: `
            INSERT INTO products (title, description, price) VALUES ($1, $2, $3) 
                RETURNING *
        `,
    CREATE_STOCK: `
            INSERT INTO stocks (count, product_id) VALUES ($1, $2)
            `,
}

