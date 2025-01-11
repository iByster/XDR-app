export interface SensorStrategy {
  process(config: any, lastExecutionTime: Date): Promise<any>;
}
