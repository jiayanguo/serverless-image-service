'use strict'

const constant = require('../constant')
const S3Service = require('../dao/awss3')
const s3Service = new S3Service()
const sharp = require('sharp')
const responseUtil = require('../util/response_util')

let customImage = {

  handler: (event, res) => {
    let originalSize = true;
    if (event.width !== 0 && event.height!== 0) {
      originalSize = false;
    }

    if (!originalSize) {
      let resized_image_path = event.imageurl.substr(0, event.imageurl.lastIndexOf('.'))
          + "/" + event.width + "x" + event.height + "." + event.format
      s3Service.getObject(constant.RESIZED_IMAGE_BUCKET, resized_image_path)
          .then(data => {
              console.log('Image is resized!')
              let buffer = new Buffer(data.Body)
              return responseUtil.imageOKResponse(res, buffer, event.format)
          })
          .catch( err => {
                  console.log('Image is not resized!')

              getImageFromOriginalS3(event, res,false, resized_image_path )
              }
          )
    } else {
        getImageFromOriginalS3(event, res,true)
    }
  }
}

let getImageFromOriginalS3 = (event, res, originalSize, resized_image_path) => {
    return s3Service.getObject(constant.CUSTOM_IMAGE_BUCKET, event.imageurl)
    .then(data => {
            if (!originalSize) {
                return sharp(data.Body)
                    .resize(event.width, event.height)
                    .toFormat(event.format)
                    .toBuffer();

            } else {
                return new Buffer(data.Body)
            }

        }
    ).then(buffer => {
            // save the resized image to s3
            if (!originalSize) {

                s3Service.putObject(constant.RESIZED_IMAGE_BUCKET,
                    resized_image_path, buffer,
                    'image/' + event.format
                )
                    .catch(err => {
                        console.log("Exception while writing resized image to bucket " + err)
                    });
            }

        return responseUtil.imageOKResponse(res, buffer, event.format)
    }).catch(
        err => {
            console.log(err)
            res.status(500).send('server error!')
        }
    )
}

module.exports = customImage
