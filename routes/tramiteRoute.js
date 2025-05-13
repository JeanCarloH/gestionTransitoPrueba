
const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middlewares/authMiddleware');
//const adminMiddleware = require('../middlewares/adminMiddleware');

module.exports = (tramiteController) => {
  // Rutas protegidas para usuarios
  router.post('/createProcess', tramiteController.createTramite);
  router.get('/', tramiteController.getAllTramites);
  router.get('/:id', tramiteController.getTramiteById);
  router.put('/:id', tramiteController.updateTramite);
  router.patch('/:id/status', tramiteController.updateTramiteStatus);
  router.delete('/:id', tramiteController.deleteTramite);
  
  // Rutas para estadísticas (solo admin)
  router.get('/stats/general', tramiteController.getTramiteStats);
  
  return router;
};