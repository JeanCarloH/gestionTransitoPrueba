
const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false
    },
    correo: {
      type: "varchar",
      length: 150,
      nullable: false,
      unique: true
    },
    rol: {
      type: "varchar",
      length: 50,
      default: "user"
    }
  }
});

module.exports = { User };
