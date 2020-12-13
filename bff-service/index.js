const express = require('express');
const axios = require('axios').default;
const NodeCache = require( "node-cache" );

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const ALL_PRODUCTS_CACHE_KEY = 'get|products'

app.all('/*', (req, res) => {
    console.log('OriginalUrl: ', req.originalUrl);
    console.log('Method: ', req.method);
    console.log('Body: ', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log('Recipient: ', recipient);

    const recipientUrl = process.env[recipient];
    console.log('RecipientUrl: ', recipientUrl);
    if (recipientUrl) {
        const cacheKey = (req.method || '').toLowerCase() + '|' + (recipient || '').toLowerCase();
        if (cacheKey === ALL_PRODUCTS_CACHE_KEY) {
            const productsFromCache = myCache.get(ALL_PRODUCTS_CACHE_KEY);
            if (productsFromCache) {
                res.json(productsFromCache)
                return;
            }
        }

        const axiosConfig = {
            method: req.method,
            url: `${recipientUrl}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };
        console.log('axiosConfig: ', axiosConfig);

        axios(axiosConfig)
            .then(response => {
                console.log('Response from recipient', response.data);

                if (cacheKey === ALL_PRODUCTS_CACHE_KEY) {
                    myCache.set(ALL_PRODUCTS_CACHE_KEY, response.data, 120)
                }
                res.json(response.data);
            })
            .catch(error => {
                console.log('Error: ', JSON.stringify(error));

                if (error.response) {
                    const {status, data} = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: error.message});
                }
            })
    } else {
        res.status(502).send('Cannot process request');
    }
})

app.listen(port, () => {
    console.log('bff-service listen on port: ', port);
});