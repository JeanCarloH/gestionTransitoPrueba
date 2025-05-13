
class TramiteService {
  constructor(tramiteRepository, userRepository) {
    this.tramiteRepository = tramiteRepository;
    this.userRepository = userRepository;
  }

  /**
   * Crea un nuevo trámite
   * @param {Object} tramiteData - Datos del trámite
   * @returns {Promise<Object>} Trámite creado
   */
  async createTramite(tramiteData) {
    try {
      console.log("tramiteData", tramiteData);
      // Verificar que el usuario existe
      if (tramiteData.usuario_id) {
        const userExists = await this.userRepository.findOne({
          where: { id: tramiteData.usuario_id }
        });
        
        if (!userExists) {
          throw new Error('El usuario especificado no existe');
        }
      }

      if (tramiteData.usuario_id) {
      tramiteData.usuario = await this.userRepository.findOneBy({ id: tramiteData.usuario_id });
      }

      delete tramiteData.usuario_id;

      const newTramite = this.tramiteRepository.create(tramiteData);

      const savedTramite = await this.tramiteRepository.save(newTramite);
      
      return savedTramite;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene todos los trámites
   */
  async getAllTramites() {
  try {
    const tramites = await this.tramiteRepository.find({
      relations: {
        usuario: true  // Usando el nombre exacto de la relación de tu entidad
      },
      order: {
        fechaCreacion: "DESC"
      }
    });

    // Simplemente retornamos los trámites
    return tramites;
  } catch (error) {
    throw error;
  }
}

 
  /**
   * Actualiza un trámite existente
   * @param {number} id - ID del trámite
   * @param {Object} tramiteData - Datos a actualizar
   * @returns {Promise<Object>} Trámite actualizado
   */
 async updateTramite(id, tramiteData) {
  try {
    const tramite = await this.tramiteRepository.findOne({ where: { id } });
    if (!tramite) {
      throw new Error('Trámite no encontrado');
    }
    await this.tramiteRepository.update(id, tramiteData);

    return this.getTramiteById(id);
  } catch (error) {
    throw error;
  }
}



  /**
   * Elimina un trámite
   * @param {number} id - ID del trámite
   * @returns {Promise<boolean>} Resultado de la operación
   */
  async deleteTramite(id) {
    try {
      const result = await this.tramiteRepository.delete(id);
      
      if (result.affected === 0) {
        throw new Error('Trámite no encontrado');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = TramiteService;