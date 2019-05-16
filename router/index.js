'use strict'

const express = require('express')
const router = express.Router();

const default_controller = require('../controller/default_controller.js')
const custom_controller = require('../controller/custom_controller.js')
const network_controller = require('../controller/network_controller')

router.get('/', default_controller);

router.get('/custom', custom_controller);
router.get('/network', network_controller);

module.exports = router;
