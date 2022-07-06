const { User } = require('../models');
const bcrypt = require('bcrypt');
const getLogger = require('../utils/logger');
const logger = getLogger(__filename);

class UsersController {
    async registerUser(req, res) {
        try {
            // Validate username against DB.
            const userExists = await User.findOne({ name: req.body.name })
            if (userExists) {
                logger.error(`Username ${req.body.name} no disponible`)
                return res.status(400).json({ error: `Username ${req.body.name} no disponible` });
            }

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);

            // Create a user from mongoose model.
            const user = await new User({
                name: req.body.name,
                password: password
            });

            // Save user to DB.
            const savedUser = await user.save();
            return res.status(201).json({
                message: "User created successfully.",
                userId: savedUser.id
            })
        } catch (err) {
            logger.error(err)
            return res.status(400).json({ error: `${err}` }).end();
        }
    }
}

module.exports = UsersController