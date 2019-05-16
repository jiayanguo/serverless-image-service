'use strict'

const customImage = require('../service/customImage_azure')

module.exports = (req, res) => {
  let format
  if (req.query.image != undefined) {
    format = req.query.image.substr(req.query.image.lastIndexOf('.')+1 ).toLowerCase();
  }

  let event = {
    width: req.query.width != undefined ? parseInt(req.query.width) : 0,
    height: req.query.height!= undefined ? parseInt(req.query.height) : 0,
    imageurl: req.query.image,
    format : format
  }

  console.log("query params: " + JSON.stringify(req.query))
  customImage.handler(event, res);
}
