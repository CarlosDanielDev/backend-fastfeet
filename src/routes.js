import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multerConfig';

import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import RecipientControler from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';
import DeliveryController from './app/controllers/DeliveryController';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/couriers', CourierController.index);
routes.get('/couriers/:courier_id', CourierController.show);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:courier_id', CourierController.update);
routes.delete('/couriers/:courier_id', CourierController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);

export default routes;
