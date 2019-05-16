'use strict'

const AWS = require('aws-sdk')
const constant = require("../../constant")

const s3 = new AWS.S3({
  accessKeyId: constant.AWS_ACCESS_KEY,
  secretAccessKey: constant.AWS_SCRET_KEY,
  region: constant.S3_REGION
})

class S3Service {
  constructor() {}
    // constructor(access_key, scret_key, region) {
    //   this.s3 = = new AWS.S3({
    //     accessKeyId: access_key,
    //     secretAccessKey: scret_key,
    //     region: region
    //   })
    // }

  getObject(bucketName, key) {
    let promise = new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Key: key
      }
      s3.getObject(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    return promise
  }

  putObject(bucketName, key, body, contentType) {
    let promise = new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        ContentType: contentType,
        Key: key,
        Body: body,
      }
      s3.putObject(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    return promise
  }
}

module.exports = S3Service
