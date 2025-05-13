// src/repositories/TramiteRepository.js
const { EntityRepository, Repository } = require('typeorm');
const { Tramite } = require('../entities/Tramite');

@EntityRepository(Tramite)
class TramiteRepository extends Repository {

  async updateTramite(id, tramiteData) {
    const tramite = await this.findOne({ where: { id } });
    
    if (!tramite) {
      throw new Error('Trámite no encontrado');
    }
    
    Object.assign(tramite, tramiteData);
    await this.save(tramite);
    
    return tramite;
  }
}

module.exports = TramiteRepository;