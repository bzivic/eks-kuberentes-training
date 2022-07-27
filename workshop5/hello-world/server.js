'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    res.write(`<html>`);
    res.write(`<body>`);
    res.write(`<h1>Hello, World!</h1>`);
    res.write(`</body>`);
    res.write(`</html>`);
    res.end();
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);