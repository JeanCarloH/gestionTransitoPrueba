// src/repositories/UserRepository.js
const { EntityRepository, Repository } = require('typeorm');
const { User } = require('../entities/User');

@EntityRepository(User)
class UserRepository extends Repository {

 
 
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