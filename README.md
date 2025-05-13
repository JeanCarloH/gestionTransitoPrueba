# Sistema de Gestión de Trámites

Sistema API REST para la gestión de trámites administrativos con manejo de usuarios y roles.

## Descripción

Este proyecto implementa una API REST para la gestión de trámites, permitiendo crear, listar, actualizar y eliminar trámites asociados a usuarios. El sistema maneja autenticación de usuarios con roles y permisos diferenciados.

## Arquitectura

El proyecto está estructurado siguiendo una **arquitectura en capas** con el patrón MVC (Modelo-Vista-Controlador), complementado con el patrón Repository y Service. Esta decisión arquitectónica se tomó por las siguientes razones:

### Capas de la aplicación:

1. **Controladores**: Manejan las peticiones HTTP, validan los datos de entrada y devuelven respuestas apropiadas.
2. **Servicios**: Contienen la lógica de negocio, coordinan operaciones entre repositorios.
3. **Repositorios**: Proporcionan una abstracción para el acceso a datos y operaciones CRUD.
4. **Modelos**: Definen la estructura de los datos en la base de datos mediante esquemas TypeORM.
5. **Rutas**: Definen los endpoints de la API y los asocian a los controladores correspondientes.

### Ventajas de esta arquitectura:

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara.
- **Mantenibilidad**: Facilita la identificación y resolución de problemas.
- **Testabilidad**: Las capas pueden probarse de forma aislada.
- **Escalabilidad**: Permite añadir nuevas funcionalidades sin modificar el código existente.
- **Reutilización**: Los componentes pueden reutilizarse en diferentes partes de la aplicación.

### Tecnologías utilizadas:

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Express**: Framework web para la creación de APIs REST.
- **TypeORM**: ORM (Object-Relational Mapping) para la gestión de la base de datos.
- **MySQL**: Sistema de gestión de bases de datos relacional.

## Estructura del proyecto

```
├── controllers/         # Controladores de la aplicación
├── database/           # Configuración de base de datos
├── models/             # Esquemas/modelos de datos
├── repositories/       # Repositorios para acceso a datos
├── routes/             # Definición de rutas
├── services/           # Servicios con lógica de negocio
└── index.js            # Punto de entrada de la aplicación
```

## Requisitos previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone https://gestionusuarios-admin@bitbucket.org/gestionusuarios/frontendgestionusuarios.git
cd backend
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tramites_db

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de JWT
JWT_SECRET=tu_clave_secreta
JWT_EXPIRATION=24h
```

4. Crear la base de datos:

```sql
CREATE DATABASE prueba;
```

El ORM se encargará de crear las tablas necesarias al iniciar la aplicación gracias a la configuración `synchronize: true` en el entorno de desarrollo.

## Ejecución

```bash
# Desarrollo
npm run dev
# o
yarn dev

# Producción
npm start
# o
yarn start
```

El servidor estará disponible en `http://localhost:4000`

## Endpoints de la API

### Usuarios

- `POST /api/users/createUser` - Crear un nuevo usuario
- `GET /api/users` - Obtener todos los usuarios (Admin)
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

### Trámites

- `POST /api/tramites/createProcess` - Crear un nuevo trámite
- `GET /api/tramites` - Obtener todos los trámites
- `PUT /api/tramites/:id` - Actualizar un trámite
- `DELETE /api/tramites/:id` - Eliminar un trámite



## Pruebas de la API

Puedes probar la API utilizando herramientas como Postman o Insomnia.

### Ejemplo de creación de usuario:

```http
POST /api/users/createUser
Content-Type: application/json

{
  "nombre": "Usuario Ejemplo",
  "correo": "usuario@example.com",
  "rol": "user"
}
```
```
Actualizar un usuario
httpPUT /api/users/1
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "correo": "actualizado@example.com",
  "rol": "admin"
}
```
```
Eliminar un usuario
httpDELETE /api/users/1
```

### Ejemplo de creación de trámite:

```http
POST /api/tramites/createProcess
Content-Type: application/json

{
  "titulo": "Solicitud de permiso",
  "descripcion": "Solicitud de permiso para ausencia laboral",
  "estado": "pendiente",
  "usuario_id": 1
}
```
```
Obtener todos los trámites
httpGET /api/tramites
```
```
Actualizar un trámite
httpPUT /api/tramites/1
Content-Type: application/json

{
  "titulo": "Solicitud de permiso actualizada",
  "descripcion": "Modificación de solicitud anterior",
  "estado": "en_proceso"
}
```
```
Eliminar un trámite
httpDELETE /api/tramites/1
```
Ejemplo de respuestas
Respuesta exitosa de creación
json{
  "success": true,
  "message": "Trámite creado exitosamente",
  "data": {
    "id": 1,
    "titulo": "Solicitud de permiso",
    "descripcion": "Solicitud de permiso para ausencia laboral",
    "estado": "pendiente",
    "fechaCreacion": "2025-05-13T14:30:00.000Z",
    "usuario": {
      "id": 1,
      "nombre": "Usuario Ejemplo",
      "correo": "usuario@example.com",
      "rol": "user"
    }
  }
}
Respuesta de error
json{
  "success": false,
  "message": "Error al crear el trámite",
  "error": "El usuario especificado no existe"
}