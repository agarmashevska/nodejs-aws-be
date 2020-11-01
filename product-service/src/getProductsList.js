import productsList from './mocks/products.json'

const products = productsList || []

export const getProductsList = async (event) => {
    try {
        if (!products.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Products are empty'
                })
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error'
            })
        };
    }
};