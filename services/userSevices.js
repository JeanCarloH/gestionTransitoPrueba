// src/services/userService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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

}

module.exports = UserService;