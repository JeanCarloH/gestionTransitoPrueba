
const express = require('express');
const cors = require('cors');
const { initializeDB, AppDataSource } = require('./database/database');
const initModels = require('./database/initModels');


const UserService = require('./services/userSevices');
const TramiteService = require('./services/tramiteServices');


const UserController = require('./controllers/userController');
const TramiteController = require('./controllers/tramiteController');

require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function initializeApp() {
  try {
    
    const dataSource = await initializeDB();
    console.log('Database connected successfully');
    

    const models = initModels(dataSource);
    
 
    const userService = new UserService(models.userRepository);
    const tramiteService = new TramiteService(models.tramiteRepository, models.userRepository);
    
   
    const userController = new UserController(userService);
    const tramiteController = new TramiteController(tramiteService);
    
    const controllers = {
      userController,
      tramiteController
    };
    

    const routes = require('./routes/index')(controllers);
    app.use('/api', routes);
    

    app.get('/', (req, res) => {
      res.json({
        message: 'Bienvenido al servidor de gestión de trámites',
        documentation: '/api'
      });
    });
    

    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? {} : err.toString()
      });
    });
    
   
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    });
    

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}


initializeApp();