'use strict'

const createHandler = require("azure-function-express").createHandler;
const express = require("express");

const app = require('./app');

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);