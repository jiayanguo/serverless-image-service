'use strict'

const constant = require('../constant')

module.exports = {
    imageOKResponse: (res, data, format) => {
        res.set('Cache-Control', constant.CACHE_HEADER);
        res.set('Content-Type', `image/${format}` );
        res.set('Content-Length', data.length)

        res.status(200).send(data);

        return res
    }
}