
const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middlewares/authMiddleware');
//const adminMiddleware = require('../middlewares/adminMiddleware');

module.exports = (userController) => {
  
  // Rutas protegidas para administradores
  router.get('/', userController.getAllUsers);
  router.post('/createUser', userController.createUser);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);
  
  return router;
};