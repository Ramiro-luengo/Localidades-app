const LocalidadesController = require('./localidades');
const UsersController = require('./users');
const authenticate = require('./auth')

module.exports = { LocalidadesController, UsersController, authenticate }