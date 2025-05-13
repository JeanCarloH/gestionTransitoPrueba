
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');  // Ruta para usuarios
const tramiteRoutes = require('./tramiteRoute');  // Ruta para trámites
module.exports = (controllers) => {

   // Rutas de usuarios
  router.use('/users', userRoutes(controllers.userController));

  // Rutas de trámites
  router.use('/tramites', tramiteRoutes(controllers.tramiteController));
  
  router.get('/', (req, res) => {
    res.json({
      message: 'Bienvenido a la API de Gestión de Trámites',
      version: '1.0.0',
      endpoints: {
        users: '/api/users',
        tramites: '/api/tramites'
      }
    });
  });
  
  return router;
};