'use strict'

const constant = require('../constant')
const S3Service = require('../dao/awss3')
const s3Service = new S3Service()
var gm = require('gm')
  .subClass({
    imageMagick: true
  }); // Enable ImageMagick integration.

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
                gm(data.Body).resize(event.width, event.height)
                .toBuffer(event.format, (err, buffer) => {
                        if (err) {
                            console.log(err)
                            es.status(500).send('server error, error while resizing!')
                        }

                        s3Service.putObject(constant.RESIZED_IMAGE_BUCKET,
                            resized_image_path, buffer,
                            'image/' + event.format
                        )
                        .catch(err => {
                            console.log("Exception while writing resized image to bucket " + err)
                        });
            
                        return responseUtil.imageOKResponse(res, buffer, event.format)
                    })
               
                // gm(data.Body).size((err, size) =>{
                //     this.resize(event.width, event.height)
                //     .toBuffer(event.format, (err, buffer) => {
                //         if (err) {
                //             console.log(err)
                //             es.status(500).send('server error, error while resizing!')
                //         }

                //         s3Service.putObject(constant.RESIZED_IMAGE_BUCKET,
                //             resized_image_path, buffer,
                //             'image/' + event.format
                //         )
                //         .catch(err => {
                //             console.log("Exception while writing resized image to bucket " + err)
                //         });
            
                //         return responseUtil.imageOKResponse(res, buffer, event.format)
                //     })
                // })
                //return responseUtil.imageOKResponse(res, new Buffer(data.Body), event.format)
            } else {
                return responseUtil.imageOKResponse(res, new Buffer(data.Body), event.format)
            }

        }
    ).catch(
        err => {
            console.log(err)
            res.status(500).send('server error!')
        }
    )
}


module.exports = customImage
