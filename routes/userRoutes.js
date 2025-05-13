
const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middlewares/authMiddleware');
//const adminMiddleware = require('../middlewares/adminMiddleware');

module.exports = (userController) => {
  // Rutas públicas
  router.post('/register', userController.register);
  router.post('/login', userController.login);
  
  // Rutas protegidas para usuarios
  router.get('/profile', userController.getProfile);
  
  // Rutas protegidas para administradores
  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.post('/createUser', userController.createUser);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);
  
  return router;
};