import axios from 'axios';
import fs from 'fs';

const LOCALIDADES_URL = "https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.5/download/localidades.json"
const LOCALIDADES_FILE_PATH = "./src/data/localidades_arg.json"

function refresh_localidades_file() {
    return new Promise(
        (resolve, reject) => {
            axios.get(LOCALIDADES_URL).then(
                res => {
                    const data = res.data

                    fs.writeFile(LOCALIDADES_FILE_PATH, JSON.stringify(data, null, 4), () => {
                        console.log('The local file has been updated!');
                        resolve(data);
                    });
                }
            ).catch((err) => reject(err))
        }
    )
}

function localidades_by_name(localidades, name) {
    return localidades.localidades.find((elem) => elem.nombre == name)
}

export default function localidades(req, res, cache) {
    let loc_promise;

    if (!fs.existsSync(LOCALIDADES_FILE_PATH)) {
        // This allows me to re-dowload the file when 
        // requesting if its missing.
        loc_promise = refresh_localidades_file();
    }
    else {
        // Uses the local file or the cache if set.
        loc_promise = new Promise(
            (resolve, reject) => {
                if (!cache.has("localidades")) {
                    fs.readFile(LOCALIDADES_FILE_PATH, (err, data) => {
                        if (err) reject(err);

                        const json_data = JSON.parse(data);
                        cache.set("localidades", json_data)
                        resolve(json_data);
                    })
                }
                else {
                    console.log("Using cached localidades")
                    resolve(cache.get("localidades"))
                }
            });
    }


    res.setHeader('Content-Type', 'application/json');
    loc_promise.then(
        (loc_data) => {
            let res_data = loc_data;
            let loc_name = req.params.name;

            if (loc_name) {
                if (cache.has(loc_name)) {
                    console.log(`Used cache hit for: ${loc_name}`)
                    res_data = cache.get(loc_name)
                }
                else {
                    res_data = localidades_by_name(loc_data, loc_name)
                    cache.set(loc_name, res_data)
                }
            }

            res.status(200).json(res_data);
        }
    ).catch(
        (err) => {
            console.log(err);
            res.status(404).json({ message: "An error has occured" });
        });
}