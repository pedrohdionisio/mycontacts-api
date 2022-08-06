const { Router } = require('express');

const ContactController = require('./app/controllers/ContactController');
const CategoryController = require('./app/controllers/CategoryController');
const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');

const authMiddleware = require('./app/middlewares/authMiddleware');

const router = Router();

router.post('/users', UserController.store);
router.post('/authenticate', AuthController.authenticate);

router.use(authMiddleware);

router.get('/users', UserController.index);
router.get('/user', UserController.show);
router.put('/users/:id', UserController.update);
router.put('/users/password/:id', UserController.updatePassword);
router.delete('/users/:id', UserController.delete);

router.get('/contacts', ContactController.index);
router.get('/contacts/:id', ContactController.show);
router.delete('/contacts/:id', ContactController.delete);
router.post('/contacts', ContactController.store);
router.put('/contacts/:id', ContactController.update);

router.get('/categories', CategoryController.index);
router.get('/categories/:id', CategoryController.show);
router.delete('/categories/:id', CategoryController.delete);
router.post('/categories', CategoryController.store);
router.put('/categories/:id', CategoryController.update);

module.exports = router;
