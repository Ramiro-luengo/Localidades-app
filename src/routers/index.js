const { Router } = require('express');

const localidadesRouter = require('./localidades');
const authRouter = require('./auth');
const usersRouter = require('./users');

const router = Router();

localidadesRouter(router);
authRouter(router);
usersRouter(router);

module.exports = router;