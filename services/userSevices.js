// src/services/userService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    try {
      // Verificar si ya existe un usuario con ese email o username
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        throw new Error('El email o nombre de usuario ya está en uso');
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Crear el usuario con la contraseña hasheada
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      const savedUser = await this.userRepository.save(newUser);
      
      // No devolver la contraseña
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
  /**
   * crear un nuevo usuario desde el dashboard
   */
  async createUserDashboard(userData) {
    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error('No se pudo crear el usuario: ' + error.message);
    }
  }
  /**
   * Obtiene todos los usuarios
   * @param {Object} options - Opciones de paginación y filtrado
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, ...filters } = options;
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAndCount({
        where: filters,
        skip,
        take: limit,
        select: ["id", "nombre", "correo", "rol"]
      });

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  async getUserById(id) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ["id", "nombre", "correo", "rol"]
      });
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(id, userData) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Si se actualiza la contraseña, la hasheamos
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      console.log("userData", userData);
      await this.userRepository.update(id, userData);
      
      // Obtenemos el usuario actualizado
      return this.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} Resultado de la operación
   */
  async deleteUser(id) {
    try {
      const result = await this.userRepository.delete(id);
      
      if (result.affected === 0) {
        throw new Error('Usuario no encontrado');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Autentica a un usuario y genera un token
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async loginUser(email, password) {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });
      
      if (!user) {
        throw new Error('Credenciales inválidas');
      }
      
      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }
      
      // Verificar si está activo
      if (!user.active) {
        throw new Error('Usuario desactivado');
      }
      
      // Generar token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '24h' }
      );
      
      const { password: userPassword, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;