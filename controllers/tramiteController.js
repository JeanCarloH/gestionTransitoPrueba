// src/controllers/tramiteController.js
class TramiteController {
  constructor(tramiteService) {
    this.tramiteService = tramiteService;
  }

  /**
   * Crea un nuevo trámite
   */
  createTramite = async (req, res) => {
    try {
      const tramiteData = req.body;
      
      const newTramite = await this.tramiteService.createTramite(tramiteData);
      
      res.status(201).json({
        success: true,
        message: 'Trámite creado exitosamente',
        data: newTramite
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el trámite',
        error: error.toString()
      });
    }
  };

  /**
   * Obtiene todos los trámites
   */
  getAllTramites = async (req, res) => {
  try {
   
    // Llamar al servicio sin parámetros de paginación
    const tramites = await this.tramiteService.getAllTramites();
    
    return res.status(200).json({
      success: true,
      message: 'Trámites obtenidos exitosamente',
      data: tramites
    });
  } catch (error) {
    console.error('Error al obtener trámites:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los trámites',
      error: error.message || error.toString()
    });
  }
};

  /**
   * Obtiene un trámite por su ID
   */
  getTramiteById = async (req, res) => {
    try {
      const { id } = req.params;
      const tramite = await this.tramiteService.getTramiteById(parseInt(id));
      
      // Verificar permisos
      if (
        req.user && 
        req.user.role !== 'admin' && 
        tramite.userId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver este trámite'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Trámite obtenido exitosamente',
        data: tramite
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Trámite no encontrado',
        error: error.toString()
      });
    }
  };

  /**
   * Actualiza un trámite
   */
  updateTramite = async (req, res) => {
    try {
      const { id } = req.params;
      const tramiteData = req.body;
      
      const updatedTramite = await this.tramiteService.updateTramite(parseInt(id), tramiteData);
      
      res.status(200).json({
        success: true,
        message: 'Trámite actualizado exitosamente',
        data: updatedTramite
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el trámite',
        error: error.toString()
      });
    }
  };

  /**
   * Actualiza el estado de un trámite
   */
  updateTramiteStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'El estado es requerido'
        });
      }
      
      // Verificar que el trámite existe y permisos
      const tramite = await this.tramiteService.getTramiteById(parseInt(id));
      
      if (
        req.user && 
        req.user.role !== 'admin' && 
        tramite.userId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar este trámite'
        });
      }
      
      const updatedTramite = await this.tramiteService.updateTramiteStatus(parseInt(id), status);
      
      res.status(200).json({
        success: true,
        message: 'Estado del trámite actualizado exitosamente',
        data: updatedTramite
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el estado del trámite',
        error: error.toString()
      });
    }
  };

  /**
   * Elimina un trámite
   */
  deleteTramite = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar que el trámite existe y permisos
      const tramite = await this.tramiteService.getTramiteById(parseInt(id));
      
      if (
        req.user && 
        req.user.role !== 'admin' && 
        tramite.userId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este trámite'
        });
      }
      
      await this.tramiteService.deleteTramite(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'Trámite eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al eliminar el trámite',
        error: error.toString()
      });
    }
  };

  /**
   * Obtiene estadísticas de trámites
   */
  getTramiteStats = async (req, res) => {
    try {
      // Solo admin puede ver estadísticas generales
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver estas estadísticas'
        });
      }
      
      const stats = await this.tramiteService.getTramiteStats();
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las estadísticas',
        error: error.toString()
      });
    }
  };
}

module.exports = TramiteController;