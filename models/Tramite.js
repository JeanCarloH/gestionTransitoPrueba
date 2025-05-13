const { EntitySchema } = require('typeorm');

const Tramite = new EntitySchema({
  name: "Tramite",
  tableName: "tramites",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    titulo: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    descripcion: {
      type: "text",
      nullable: true
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente"
    },
    fechaCreacion: {
      name: "fecha_creacion",
      type: "timestamp",
      createDate: true
    }
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "usuario_id"
      },
      onDelete: "CASCADE"
    }
  }
});

module.exports = { Tramite };
