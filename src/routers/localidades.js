const { verifyToken } = require('../middlewares')
const { LocalidadesController } = require('../controllers');

const localidadesRouter = (router) => {
    const locController = new LocalidadesController();

    router.get('/localidades', verifyToken, locController.localidades.bind(locController));
    router.get('/localidades/:name', verifyToken, locController.localidad.bind(locController));

    return router
}


module.exports = localidadesRouter;