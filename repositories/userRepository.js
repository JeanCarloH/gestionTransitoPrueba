// src/repositories/UserRepository.js
const { EntityRepository, Repository } = require('typeorm');
const { User } = require('../entities/User');

@EntityRepository(User)
class UserRepository extends Repository {
  async findByCorreo(correo) {
    return this.findOne({ where: { correo } });
  }

  async findByRol(rol) {
    return this.find({ where: { rol } });
  }

  async searchUsers(searchText) {
    return this.createQueryBuilder('user')
      .where('user.nombre LIKE :searchText', { searchText: `%${searchText}%` })
      .orWhere('user.correo LIKE :searchText', { searchText: `%${searchText}%` })
      .getMany();
  }
  
  async findWithPagination(options = {}) {
    const { page = 1, limit = 10, ...filters } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await this.findAndCount({
      where: filters,
      skip,
      take: limit
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
  }
 
  async updateUser(id, userData) {
    await this.update(id, userData);
    return this.findOne(id); 
  }

 
async deleteUser(id) {
    const user = await this.findOne(id);
    if (!user) {
    throw new Error('Usuario no encontrado');
    }
    await this.remove(user);
    return user;
}

}

module.exports = UserRepository;