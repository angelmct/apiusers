import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Usuario from '../models/usuario';

// export es para importar a cualquier otro archivo
export default class UserController extends BaseController {
  static basePath = '/api/v1/users';

  initialize() {
    // endpoints -> es cada una de las funciones que se pueden ejecutar
    this.app.get(UserController.basePath, UserController.getAllUsers); // no lleva parentesis porque esta pasando todos los páramentros

    // GET get post by id
    // interpolacion de cadenas, concatenar
    this.app.get(`${UserController.basePath}/:id`, UserController.getUserbyId);
    // CREATE POST
    this.app.post(UserController.basePath, UserController.createUser);
    // UPDATE
    this.app.put(`${UserController.basePath}/:id`, UserController.updateUser);
    // DELETE
    this.app.delete(
      `${UserController.basePath}/:id`,
      UserController.deleteUser
    );
  }

  static mount(app) {
    return new UserController(app);
  }

  // Start: endpoints
  static async getAllUsers(req, res) {
    try {
      const user = await new Usuario().get(); // mandar llamar todos los post en la base datos
      respond(res, OK, user); // lista de posts
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async getUserbyId(req, res) {
    try {
      const { id } = req.params; // es parte del objeto
      const user = await new Usuario(id).getByKey();

      if (!user) {
        respond(res, NOT_FOUND);
      }

      respond(res, OK, user);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async createUser(req, res) {
    try {
      const expectedParams = [
        'nombre',
        'apellido',
        'correo',
        'password',
        'telefono'
      ];
      const validationErrors = []; // se iran agregando los errores

      expectedParams.forEach(param => {
        // se revisa si el body no tiene cada propiedad, entonces agrega la cadena parameter was not found...
        if (!req.body[param]) {
          validationErrors.push(
            `${param} parameter was not found in the request`
          );
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\\n')
        });
        return;
      }
      // validar que se ingresen los parametros
      const { correo, password, nombre, apellido, telefono } = req.body;

      const user = Usuario.newUser(
        nombre,
        apellido,
        correo,
        password,
        telefono
      );
      await user.create();

      respond(res, OK, user);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params; // se extrae el id del request

      const user = await new Usuario(id).getByKey(); // obtenemos el post por id

      if (!user) {
        respond(res, NOT_FOUND); // si no existe, respondemos not found
        return;
      }

      const expectedParams = [
        'nombre',
        'apellido',
        'correo',
        'password',
        'telefono'
      ]; // parametros a actualizar

      Object.keys(req.body).forEach(param => {
        // object.keys regresa los nombres de las propiedades de un objeto
        if (expectedParams.includes(param)) {
          user[param] = req.body[param];
        }
      });

      // user.updatePost = new Date(); // fecha actual
      await user.update();

      respond(res, OK, user);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await new Usuario(id).delete();
      respond(res, OK);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  // End: endpoints
}
