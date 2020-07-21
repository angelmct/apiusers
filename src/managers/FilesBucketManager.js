import AWS from 'aws-sdk';

export default class FilesManager {
  static _presignedUrlExpirationSeconds = 900;
  // guion para simular privada

  static _createS3Client() {
    return new AWS.S3({
      region: 'us-east-1'
    });
  }

  static getPresignedUrl(fileName, operation) {
    // regresa una promesa

    const client = FilesManager._createS3Client();

    const params = {
      Bucket: 'angelmct-file-sharing',
      Key: fileName,
      ContentType: '',
      Expires: FilesManager._presignedUrlExpirationSeconds
    };

    return client.getSignedUrlPromise(operation, params);
  }

  static listObject(nexContinuationToken) {
    return new Promise((resolve, reject) => {
      const client = new FilesManager._createS3Client();

      const params = {
        Bucket: 'angelmct-file-sharing'
      };

      if (nexContinuationToken) {
        params.NexContinuationToken = nexContinuationToken;
      }

      client.listObjectsV2(params, async (err, data) => {
        if (err) {
          // rechaza la promesa
          reject(err);
        } else {
          const objects = [
            ...data.Contents, // spread del resultad
            ...(data.NexContinuationToken
              ? await FilesManager.listObject(data.NexContinuationToken)
              : []) // recursivo
          ];
          resolve(objects);
        }
      });
    });
  }

  static getFileContent(key) {
    return new Promise((resolve, reject) => {
      const client = FilesManager._createS3Client();

      const params = {
        Bucket: 'angelmct-file-sharing',
        Key: key
      };

      client.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body.toString());
        }
      });
    });
  }
}
