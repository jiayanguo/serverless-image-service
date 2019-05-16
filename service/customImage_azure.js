'use strict'

const constant = require('../constant')
const Service = require('../dao/azure')
const service = new Service()
const jimp = require('jimp');

const responseUtil = require('../util/response_util')

let customImage = {

  handler: (event, res) => {

    let originalSize = true;
    if (event.width !== 0 && event.height !== 0) {
      originalSize = false;
    }

    if (!originalSize) {
      let resized_image_path = event.imageurl.substr(0, event.imageurl.lastIndexOf(
        '.')) + "/" + event.width + "x" + event.height + "." + event.format
      service.downloadBlob(constant.AZURE_IMAGE_RESZIED_BLOB,
          resized_image_path, event.format)
        .then(data => {
          console.log("Image is resized!")
          return responseUtil.imageOKResponse(res, data, event.format)
        }).catch(err => {
          console.log('Image is not resized!')
          getImageFromOriginalBlob(event, res, false, resized_image_path)
        })

    } else {
      getImageFromOriginalBlob(event, res, true, resized_image_path)
    }
  }
}

let getImageFromOriginalBlob = (event, res, originalSize, resized_image_path) => {

  service.downloadBlob(constant.AZURE_IMAGE_BLOB, event.imageurl, event.format)
    .then(data => {

      if (!originalSize) {
        jimp.read(data).then((thumbnail) => {

          thumbnail.resize(event.width, event.height);

          thumbnail.getBuffer(jimp.MIME_PNG, (err, buffer) => {
            if (err) {
              console.log(err)
              res.status(500).send(
                'server error, error while resizing!')
            }

            service.uploadToBlob(constant.AZURE_IMAGE_RESZIED_BLOB,
                resized_image_path, buffer)
              .catch(err => {
                console.log(
                  "Exception while writing resized image to bucket " +
                  err)
              });

            return responseUtil.imageOKResponse(res, buffer, event.format)
          });

        })
      } else {
        return responseUtil.imageOKResponse(res, data, event.format)
      }

    }).catch (err => {
      console.log(err)
              res.status(404).send(
                'Image not found!')
    })
}

module.exports = customImage
