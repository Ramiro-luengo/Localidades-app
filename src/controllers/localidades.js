const fs = require('fs');
const axios = require('axios');
const NodeCache = require('node-cache');
const getLogger = require('../utils/logger');
const logger = getLogger(__filename);

const LOCALIDADES_URL = "https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.5/download/localidades.json"
const LOCALIDADES_FILE_PATH = `${__dirname}/data/localidades_arg.json`

class LocalidadesController {
    constructor() {
        // Cache only to not search the big localidades list every time.
        this.cache = new NodeCache({ stdTTL: process.env.CACHE_TTL });
    }

    async refresh_localidades_file() {
        const res = await axios.get(LOCALIDADES_URL);
        const data = await res.data;

        // Can write to the file and contine, doesn't need to be sync.
        fs.writeFile(LOCALIDADES_FILE_PATH, JSON.stringify(data, null, 4), () => {
            logger.info('The local file has been updated!');
        });

        return data
    }

    async getLocalidadesData() {
        if (!fs.existsSync(LOCALIDADES_FILE_PATH)) {
            // Re-download file.
            return this.refresh_localidades_file();
        }
        else {
            // Use local file.
            const data = fs.readFileSync(LOCALIDADES_FILE_PATH);

            return JSON.parse(data);
        }
    }

    async localidad(req, res) {
        const name = req.params.name;
        if (!name) {
            return res.status(404).json({ error: "Please input a valid name" });
        }

        const localidades = await this.getLocalidadesData();

        if (this.cache.has(name)) {
            logger.info(`Used cache hit for: ${name}`);
            res_data = this.cache.get(name);
        }
        else {
            res_data = localidades.localidades.find((elem) => elem.nombre == name);
            this.cache.set(name, res_data);
        }

        if (res_data) {
            return res.status(200).json(res_data);
        }
        else {
            return res.status(404).json({ error: `Localidad ${name} doesn't exist, try another one!` });
        }
    }

    async localidades(req, res) {
        try {
            const localidadesData = await this.getLocalidadesData();

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(localidadesData);
        }
        catch (err) {
            logger.error(err);
            return res.status(404).json({ message: "An error has occured" });
        }
    }
}

module.exports = LocalidadesController;