'use strict'

const storage = require('azure-storage');
const constant = require("../../constant")
const stream = require('stream');

const blobService = storage.createBlobService(constant.AZURE_BLOB);

class BlobService {
  listBlobs(containerName) {
    return new Promise((resolve, reject) => {
      blobService.listBlobsSegmented(containerName, null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `${data.entries.length} blobs in '${containerName}'`,
            blobs: data.entries
          });
        }
      });
    });
  };

  downloadBlob(containerName, blobName) {

    return new Promise((resolve, reject) => {
      let chunks = []
      let fileStream = blobService.createReadStream(containerName,
        blobName);
      fileStream.on('data', (chunk) => {
        chunks.push(chunk)
      })

      fileStream.on('end', () => {
        console.log('stream finish')
        resolve(Buffer.concat(chunks))
      })

      fileStream.on('error', (error) => {
        console.log(error)
        reject(error)
      })
    });

  }

  uploadToBlob(containerName, blobName, buffer) {
    return new Promise((resolve, reject) => {
      const readStream = stream.PassThrough();
      readStream.end(buffer);

      blobService.createBlockBlobFromStream(containerName, blobName,
        readStream, buffer.length, (err) => {
          if (err) {
            console.log(err)
            reject(err);
          } else {

            resolve('Resized image uploaded!');
          }
        });
    });
  }

}

module.exports = BlobService
