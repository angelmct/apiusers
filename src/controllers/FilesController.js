import { OK, BAD_REQUEST } from 'http-status-codes';
import { respond } from '../utils/response';
import FilesManager from '../managers/FilesBucketManager';
import BaseController from './BaseController';

export default class FilesController extends BaseController {
  static basePath = '/api/v1/files';

  initialize() {
    // /get upload presigned URL
    this.app.get(
      `${FilesController.basePath}/upload`,
      FilesController.getNewFileUploadUrl
    );

    // GET list object in bucket
    this.app.get(FilesController.basePath, FilesController.listObjects);

    // GET get file content
    this.app.get(
      `${FilesController.basePath}/content`,
      FilesController.getFileContents
    );
  }

  static mount(app) {
    return new FilesController(app);
  }

  static async getNewFileUploadUrl(req, res) {
    try {
      const { filename } = req.query;
      // destructuracion, toma el valor de un objeto
      if (!filename) {
        respond(res, BAD_REQUEST, {
          message: 'filename is required'
        });
        return;
      }

      // obtener la url prefirmada
      const url = await FilesManager.getPresignedUrl(filename, 'putObject');
      // {url}
      respond(res, OK, { url });
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }

  static async listObjects(req, res) {
    try {
      const objects = await FilesManager.listObject();
      respond(res, OK, objects);
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }

  static async getFileContents(req, res) {
    try {
      const { fileName } = req.query;

      const content = await FilesManager.getFileContent(fileName);

      respond(res, OK, { content });
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }
}
