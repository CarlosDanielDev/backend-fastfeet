import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import RecipientControler from './app/controllers/RecipientController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.get('/users', UserController.index);
routes.get('/users/:user_id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.delete('/users/:user_id', UserController.delete);

routes.get('/recipients', RecipientControler.index);
routes.get('/recipients/:recipient_id', RecipientControler.show);
routes.post('/recipients', RecipientControler.store);
routes.put('/recipients/:recipient_id', RecipientControler.update);
routes.delete('/recipients/:recipient_id', RecipientControler.delete);

export default routes;
