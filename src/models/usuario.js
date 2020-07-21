import { v4 as uuidv4 } from 'uuid';
import DBManager from '../managers/DBManager';

const usersDBSchema = {
  id: {
    type: String,
    hashKey: true // Define partition key
  },
  nombre: String,
  apellido: String,
  correo: String,
  password: String,
  telefono: String
};

export default class Usuario extends DBManager {
  id;

  nombre;

  apellido;

  correo;

  password;

  telefono;

  constructor(id, nombre, apellido, correo, password, telefono) {
    super('Users', usersDBSchema); // se manda llamar el constructor de la clase padre
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.password = password;
    this.telefono = telefono;
  }

  toDBFormat() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      password: this.password,
      telefono: this.telefono
    };
  }

  getKey() {
    return {
      id: this.id
    };
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(post) {
    return new Usuario(
      post.id,
      post.nombre,
      post.apellido,
      post.correo,
      post.password,
      post.telefono
    );
  }

  static newUser(nombre, apellido, correo, password, telefono) {
    // factory function
    // uuid, valor string basado en la fecha y otros parametros
    const id = uuidv4();
    return new Usuario(id, nombre, apellido, correo, password, telefono);
  }
}
