const express = require('express');
const decoder = require('../../services/base64Decoder')
const responseParser = require('../../services/contentTypeParser')
const router = express.Router();

const controller = require('./eproxy.controller')(responseParser, decoder)
const { paramsValidator, urlDecoder, fetch } = controller

/* GET Fetch */
router.get('/:encodedUrls/:resType', paramsValidator, urlDecoder, fetch);

module.exports = router;
