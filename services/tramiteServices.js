
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
   * Obtiene un trámite por su ID
   * @param {number} id - ID del trámite
   * @returns {Promise<Object>} Trámite encontrado
   */
  async getTramiteById(id) {
    try {
      const tramite = await this.tramiteRepository.findOne({
        where: { id },
        relations: ["usuario"]
      });
      
      if (!tramite) {
        throw new Error('Trámite no encontrado');
      }
      
      
      return tramite;
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
   * Actualiza el estado de un trámite
   * @param {number} id - ID del trámite
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Trámite actualizado
   */
  async updateTramiteStatus(id, status) {
    try {
      // Validar que el estado sea válido
      const validStatus = ['pendiente', 'en_proceso', 'completado', 'rechazado'];
      
      if (!validStatus.includes(status)) {
        throw new Error(`Estado no válido. Los estados permitidos son: ${validStatus.join(', ')}`);
      }
      
      return this.updateTramite(id, { status });
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

  /**
   * Obtiene estadísticas de trámites
   * @returns {Promise<Object>} Estadísticas
   */
  async getTramiteStats() {
    try {
      // Total de trámites por estado
      const statusStats = await this.tramiteRepository
        .createQueryBuilder("tramite")
        .select("tramite.status", "status")
        .addSelect("COUNT(tramite.id)", "count")
        .groupBy("tramite.status")
        .getRawMany();

      // Total de trámites por tipo
      const typeStats = await this.tramiteRepository
        .createQueryBuilder("tramite")
        .select("tramite.type", "type")
        .addSelect("COUNT(tramite.id)", "count")
        .groupBy("tramite.type")
        .getRawMany();

      // Trámites creados por mes (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyStats = await this.tramiteRepository
        .createQueryBuilder("tramite")
        .select("YEAR(tramite.created_at)", "year")
        .addSelect("MONTH(tramite.created_at)", "month")
        .addSelect("COUNT(tramite.id)", "count")
        .where("tramite.created_at >= :date", { date: sixMonthsAgo })
        .groupBy("YEAR(tramite.created_at)")
        .addGroupBy("MONTH(tramite.created_at)")
        .orderBy("year", "ASC")
        .addOrderBy("month", "ASC")
        .getRawMany();

      return {
        byStatus: statusStats,
        byType: typeStats,
        monthly: monthlyStats,
        total: await this.tramiteRepository.count()
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TramiteService;