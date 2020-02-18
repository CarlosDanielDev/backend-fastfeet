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
import WithdrawDeliveryController from './app/controllers/WithdrawDeliveryController';
import FinalizeDeliveryController from './app/controllers/FinalizeDeliveryController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ZipCodeController from './app/controllers/ZipCodeController';
import CourierActionsController from './app/controllers/CourierActionsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/zipcode-info', ZipCodeController.show);

routes.post('/sessions', SessionController.store);

routes.put(
  '/delivery/finalize/:courierId/:deliveryId',
  FinalizeDeliveryController.update
);

routes.put(
  '/delivery/withdraw/:courierId/:deliveryId',
  WithdrawDeliveryController.update
);
routes.post('/files', upload.single('file'), FileController.store);

// deliveries pending
routes.get(
  '/courier/:courierId/deliveries/pending',
  CourierActionsController.index
);

// deliveries finalized
routes.get('/courier/:courierId/deliveries', CourierActionsController.show);

// problems
routes.post('/delivery/:deliveryId/problems', DeliveryProblemController.store);
routes.get('/delivery/:deliveryId/problems', DeliveryProblemController.show);
// Auth
routes.use(auth);

// Users

routes.get('/users', UserController.index);
routes.get('/users/:user_id', UserController.show);
routes.post('/users', UserController.store);

// recipients
routes.get('/recipients', RecipientControler.index);
routes.get('/recipients/:recipient_id', RecipientControler.show);
routes.post('/recipients', RecipientControler.store);
routes.put('/recipients/:recipient_id', RecipientControler.update);
routes.delete('/recipients/:recipient_id', RecipientControler.delete);

// couriers
routes.get('/couriers', CourierController.index);
routes.get('/couriers/:courier_id', CourierController.show);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:courier_id', CourierController.update);
routes.delete('/couriers/:courier_id', CourierController.delete);

// deliveries
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:deliveryId', DeliveryController.update);
routes.delete('/deliveries/:deliveryId', DeliveryController.delete);

// calcel delivery
routes.delete(
  '/problem/:deliveryId/cancel-delivery',
  CancelDeliveryController.delete
);

// get problems
routes.get('/delivery/problems', DeliveryProblemController.index);

export default routes;
