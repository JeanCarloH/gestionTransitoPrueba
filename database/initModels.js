
const { User } = require('../models/user');
const { Tramite } = require('../models/tramite');

/**
 * Inicializa los modelos y sus relaciones
 * @param {DataSource} dataSource - La fuente de datos TypeORM inicializada
 */
const initModels = (dataSource) => {
  const models = {
    userRepository: dataSource.getRepository(User),
    tramiteRepository: dataSource.getRepository(Tramite),
  };
  
  console.log('Models initialized successfully');
  
  return models;
};

module.exports = initModels;