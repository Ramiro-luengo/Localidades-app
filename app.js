import express from 'express';
import dotenv from 'dotenv';
import { localidades } from './src/localidades.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL })

dotenv.config()

const app = express()
const port = process.env.PORT
const host = '0.0.0.0';


app.set('json spaces', 4)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/localidades', (req, res) => localidades(req, res, cache))
app.get('/localidades/:name', (req, res) => localidades(req, res, cache))

app.listen(port, host, () => {
    console.log(`App listening on port ${port}`)
})