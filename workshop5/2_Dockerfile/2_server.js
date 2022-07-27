'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const SITE_COLOR = process.env.SITE_COLOR;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// App
const app = express();
app.get('/', (req, res) => {
    res.write(`<html>`);
    res.write(`<body>`);
    res.write(`<h1>Hello, World!</h1>`);
    res.write(`Your Site color is: ${SITE_COLOR}<br/>`);
    res.write(`Your DB Username is: ${DB_USERNAME}<br/>`);
    res.write(`Your DB Password is: ${DB_PASSWORD}<br/>`);
    let rawjson = fs.readFileSync('/config/config.json');
    res.write(`Your language setting is ${JSON.parse(rawjson).LANGUAGE}<br/>`)
    res.write(`</body>`);
    res.write(`</html>`);
    res.end();
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);