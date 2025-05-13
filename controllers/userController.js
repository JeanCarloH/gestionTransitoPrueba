
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Registra un nuevo usuario
   */
  register = async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
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
  };

  /**
   * Inicia sesión de usuario
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }
      
      const loginResult = await this.userService.loginUser(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: loginResult
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Credenciales inválidas',
        error: error.toString()
      });
    }
  };

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
   * Obtiene un usuario por su ID
   */
  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'Usuario obtenido exitosamente',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Usuario no encontrado',
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
   * Obtiene el perfil del usuario autenticado
   */
  getProfile = async (req, res) => {
    try {
        console.log('req.user', req.user);
      const userId = req.user.id; // Asumiendo que middleware de autenticación agrega esto
      const user = await this.userService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Usuario no encontrado',
        error: error.toString()
      });
    }
  };

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