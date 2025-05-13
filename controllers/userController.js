
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

 
  /**
   * Obtiene todos los usuarios
   */
  getAllUsers = async (req, res) => {
    try {
      const { page, limit, ...filters } = req.query;
      const users = await this.userService.getAllUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        ...filters
      });
      
      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los usuarios',
        error: error.toString()
      });
    }
  };

  /**
   * Crear un nuevo usuario
   */
    createUser = async (req, res) => {
        try {
        const userData = req.body;
        const newUser = await this.userService.createUserDashboard(userData);
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: newUser
        });
        } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear el usuario',
            error: error.toString()
        });
        }
    }


  /**
   * Actualiza un usuario
   */
  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(parseInt(id), userData);
      
      res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el usuario',
        error: error.toString()
      });
    }
  };

  /**
   * Elimina un usuario
   */
  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al eliminar el usuario',
        error: error.toString()
      });
    }
  };
}

module.exports = UserController;