const { UsersController } = require('../controllers');

const usersRouter = (router) => {
    const controller = new UsersController();

    router.post('/users', controller.registerUser.bind(controller))
    return router
}

module.exports = usersRouter