import AWS from 'aws-sdk'
import {prop} from 'lodash/fp'
import { BUCKET } from './common/constants'
import { corsHeaders } from "./common/headers";

export const importProductsFile = async (event) => {
    console.log(`ImportProductsFile service with event: ${JSON.stringify(event)} `)
    const fileName = prop('queryStringParameters.name', event);

    if (!fileName) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 400,
                message: 'File name not specified'
            })
        };
    }
    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${fileName}`,
        ContentType: 'text/csv',
        Expires: 60,
    };

    try {
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const signedUrl= await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: signedUrl
        }
    } catch (e) {
        console.error(`ImportProductsFile service error: ${e}`)
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                statusCode: 500,
                message: e.message,
            })
        };
    }
}