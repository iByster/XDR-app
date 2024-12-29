export interface SensorStrategy {
  process(config: any): Promise<any>;
}
