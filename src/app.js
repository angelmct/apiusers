import express from 'express';
import cors from 'cors'; // forma para que las api se abran a cierto numero de clientes
import bodyParser from 'body-parser';
import HelloController from './controllers/HelloController';
import UserController from './controllers/UserController';

const app = express();
app.use(cors());
app.use(bodyParser.json());

HelloController.mountController(app);
UserController.mount(app);

export default app;
