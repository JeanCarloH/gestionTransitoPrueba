// src/repositories/TramiteRepository.js
const { EntityRepository, Repository } = require('typeorm');
const { Tramite } = require('../entities/Tramite');

@EntityRepository(Tramite)
class TramiteRepository extends Repository {
  async findByUsuarioId(usuarioId) {
    return this.find({ 
      where: { usuario: { id: usuarioId } },
      order: { fechaCreacion: 'DESC' },
      relations: ['usuario']
    });
  }

  async findByEstado(estado) {
    return this.find({ 
      where: { estado },
      order: { fechaCreacion: 'DESC' },
      relations: ['usuario']
    });
  }

  async findRecientes(limit = 10) {
    return this.find({
      order: { fechaCreacion: 'DESC' },
      take: limit,
      relations: ['usuario']
    });
  }

  async searchTramites(searchText) {
    return this.createQueryBuilder('tramite')
      .leftJoinAndSelect('tramite.usuario', 'usuario')
      .where('tramite.titulo LIKE :searchText', { searchText: `%${searchText}%` })
      .orWhere('tramite.descripcion LIKE :searchText', { searchText: `%${searchText}%` })
      .orderBy('tramite.fechaCreacion', 'DESC')
      .getMany();
  }

  async findWithPagination(options = {}) {
    const { page = 1, limit = 10, estado, usuarioId, ...otherFilters } = options;
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    
    if (estado) whereClause.estado = estado;
    if (usuarioId) whereClause.usuario = { id: usuarioId };
    
    Object.assign(whereClause, otherFilters);

    const [tramites, total] = await this.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      relations: ["usuario"],
      order: {
        fechaCreacion: "DESC"
      }
    });

    return {
      tramites,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateEstadoBulk(ids, estado) {
    const result = await this.createQueryBuilder()
      .update()
      .set({ estado })
      .whereInIds(ids)
      .execute();
    
    return result.affected > 0;
  }
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