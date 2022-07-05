import express from 'express';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

import localidades from './src/views/localidades.js';
import User from './src/models/user.js';

const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL })

dotenv.config();

// Connect Database.
const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@
${process.env.MONGO_SERVICE_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}
?retryWrites=true&w=majority`;

mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(
    () => console.log('Database connected successfully')
).catch(
    e => console.log('error db:', e)
)

// middleware to validate token (protected routes)
function verifyToken(req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ error: 'Access denied' })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ error: 'Token invalid or expired' })
    }
}


const app = express();
const port = process.env.PORT;
const host = '0.0.0.0';


app.set('json spaces', 4)
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/localidades', verifyToken, (req, res) => localidades(req, res, cache))
app.get('/localidades/:name', verifyToken, (req, res) => localidades(req, res, cache))
app.post('/users', async (req, res) => {
    try {
        // Validate username against DB.
        const userExists = await User.findOne({ name: req.body.name })
        if (userExists) {
            console.log(`Username ${req.body.name} no disponible`)
            return res.status(400).json({ error: `Username ${req.body.name} no disponible` });
        }

        // Create a user from mongoose model.
        const user = await new User({
            name: req.body.name,
            password: req.body.password
        });

        // Save user to DB.
        const savedUser = await user.save();
        return res.status(201).json({
            message: "User created successfully.",
            userId: savedUser.id
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: `${err}` }).end();
    }
})
app.post('/auth', async (req, res) => {
    // Validate user exists.
    const user = await User.findOne({ name: req.body.name, password: req.body.password })
    if (!user) {
        return res.status(400).json({ error: 'Username or password are incorrect' });
    }

    // create token
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_TTL })

    res.header('auth-token', token).json({
        data: { token }
    })
})

app.listen(port, host, () => {
    console.log(`App listening on port ${port}`)
})