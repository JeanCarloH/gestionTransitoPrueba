
const express = require('express');
const router = express.Router();

module.exports = (tramiteController) => {
  // Rutas protegidas para usuarios
  router.post('/createProcess', tramiteController.createTramite);
  router.get('/', tramiteController.getAllTramites);
  router.put('/:id', tramiteController.updateTramite);
  router.delete('/:id', tramiteController.deleteTramite);
  
  return router;
};