class Sensor {
  id: number;
  enabled: boolean;
  sensorType: string;
  config: any;

  constructor(data: any) {
    this.id = data.id;
    this.enabled = data.enabled;
    this.sensorType = data.sensorType;
    this.config = data.config;
  }
}

export default Sensor;
