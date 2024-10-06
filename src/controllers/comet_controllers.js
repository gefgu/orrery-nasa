import { findCometByName, saveComet } from '../db/sqlite.js';
import { findOnAPI } from '../services/gemini_api.js';
import { CometData } from '../services/comet_data.js';

export async function generate_comet_history(name) {

    let comet = await findCometByName(name);

    if (!comet) {
        comet = new CometData({
            name: "1P/Halley",
            eccentricity: 0.9671,
            semiMajorAxis: 17.83,
            orbitalPeriod: 75.32,
            perihelionDistance: 0.585,
            inclination: 162.26,
            meanAnomaly: 38.38,
            sizeEstimate: null
        });
        comet = await findOnAPI(comet)

        saveComet(comet)
        return comet.description;
    }
    
    return comet.description;
}

const astro = await generate_comet_history("1P/Halley")

// console.log(astro);
