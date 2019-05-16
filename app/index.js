'use strict'

const express = require('express');
const app = express();
const router = require('../router');

app.get('/', (req, res) => {
  res.status(200).send("This is server root path");
})
app.get('/api', (req, res) => {
    res.status(200).send("This is api root path");
  })

app.use('/api/imageserver', router);

module.exports = app;