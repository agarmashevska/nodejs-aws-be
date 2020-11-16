import AWS from 'aws-sdk'
import { prop } from 'lodash/fp'
import { BUCKET } from './common/constants'
import { corsHeaders } from "./common/headers";
const csv = require('csv-parser')

const importFile = (s3, key, params) => new Promise((resolve, reject) => {
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream
        .pipe(csv())
        .on('error', (error) => {
            console.error(`ImportFileParser error: ${error.message}`)
            reject(error)
        })
        .on('data', (data) => {
            console.log(`ImportFileParser data: ${data}`);
        })
        .on('end', async () => {
            console.log(`ImportFileParser key: ${key}`)
            const destinationKey = key.replace('uploaded', 'parsed')
            console.log(`ImportFileParser destination key: ${destinationKey}`)

            await s3
                .copyObject({
                    Bucket: BUCKET,
                    CopySource: `${BUCKET}/${params.Key}`,
                    Key: destinationKey,
                })
                .promise();
            console.log(`ImportFileParser - file was copied`)
            await s3
                .deleteObject(params)
                .promise();
            console.log(`ImportFileParser - file was deleted`)
            resolve();
        });
})

export const importFileParser = async (event) => {
    try {
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const Records = prop('Records', event);


        for (let record of Records) {
            const Key = prop('s3.object.key', record)
            const params = {
                Bucket: BUCKET,
                Key,
            }
            await importFile(s3, Key, params)
        }

        return {
            statusCode: 202,
            headers: corsHeaders,
            body: JSON.stringify({
               status: 202,
               message: `Specified file was being processed`
            })
        }
    } catch (e) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 500,
                message: e.message
            })
        }
    }
}