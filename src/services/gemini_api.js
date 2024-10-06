import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config( { path: '../../.env' } );

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function findOnAPI(comet) {
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
    comet.description = result.response.text();
    
    return comet;
}
