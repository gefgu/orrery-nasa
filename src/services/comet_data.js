export class CometData {
    constructor(params) {
      this.name = params.name;
      this.eccentricity = params.eccentricity;
      this.semiMajorAxis = params.semiMajorAxis;
      this.orbitalPeriod = params.orbitalPeriod;
      this.perihelionDistance = params.perihelionDistance;
      this.inclination = params.inclination;
      this.meanAnomaly = params.meanAnomaly;
      this.sizeEstimate = params.sizeEstimate || "não fornecida";
      this.description = params.description
    }
}
