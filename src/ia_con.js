import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

class CometData {
    /**
     * @param {Object} params
     * @param {string} params.name - Nome do objeto
     * @param {number} params.eccentricity - Excentricidade da órbita
     * @param {number} params.semiMajorAxis - Semieixo maior em UA
     * @param {number} params.orbitalPeriod - Período orbital em anos
     * @param {number} params.perihelionDistance - Distância do periélio em UA
     * @param {number} params.inclination - Inclinação em graus
     * @param {number} params.meanAnomaly - Anomalia média na época em graus
     * @param {string|null} params.sizeEstimate - Estimativa de tamanho (opcional)
     */
    constructor(params) {
      this.name = params.name;
      this.eccentricity = params.eccentricity;
      this.semiMajorAxis = params.semiMajorAxis;
      this.orbitalPeriod = params.orbitalPeriod;
      this.perihelionDistance = params.perihelionDistance;
      this.inclination = params.inclination;
      this.meanAnomaly = params.meanAnomaly;
      this.sizeEstimate = params.sizeEstimate || "não fornecida";
    }
  }

async function get_comet_fun_history(comet) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Usando os seguintes parâmetros Keplerianos para um cometa, crie uma história divertida e envolvente para crianças. A história deve:

    Começar com um nome lúdico para o cometa (com base em sua velocidade ou características únicas, como excentricidade ou formato).
    Destacar sua velocidade (calculada a partir de sua órbita).
    Descrever a distância que ele percorre em um ano de uma forma divertida e relacionável.
    Mencionar seu tamanho ou formato (por exemplo, é grande e redondo ou longo e fino? ​​Você pode usar excentricidade e semieixo maior para sugerir isso).
    Terminar revelando o nome científico real do cometa.
    Mantenha o tom leve, divertido e emocionante com comparações lúdicas (como viajar ao redor da Terra ou ser rápido como um foguete). Adicione emojis para tornar a história mais envolvente.

    Parâmetros de Kepler:

    Objeto: ${comet.name}
    Excentricidade (e): ${comet.eccentricity}
    Semieixo maior (a): ${comet.semiMajorAxis}
    Período orbital (P): ${comet.orbitalPeriod} (em anos)
    Distância do periélio (q): ${comet.perihelionDistance} (em UA)
    Inclinação (i): ${comet.inclination} (em graus)
    Anomalia média na época (M): ${comet.meanAnomaly} (em graus)
    Estimativa de tamanho: ${comet.sizeEstimate}

    Forneça a saída em quatro seções curtas:

    Uma introdução divertida de nome com um emoji, sugerindo sua velocidade ou forma. (1 frase)
    Velocidade e distância: Uma explicação lúdica de sua velocidade (em km/h) e distância percorrida em um ano, com comparações divertidas (por exemplo, viagens ao redor da Terra ou veículos rápidos).
    Tamanho/Formato: Descreva seu tamanho e formato, usando a excentricidade para sugerir se é mais "longo e fino" ou "redondo".
    Revele seu nome científico, terminando com uma declaração divertida. (1 frase)
    `;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

const comet = new CometData({
    name: "1P/Halley",
    eccentricity: 0.9671429085,
    semiMajorAxis: 17.834144312499454,
    orbitalPeriod: 75.32,
    perihelionDistance: 0.5859781115,
    inclination: 162.2626906,
    meanAnomaly: 38.382174454019896,
    sizeEstimate: null
});

get_comet_fun_history(comet);