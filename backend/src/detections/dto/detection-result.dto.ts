export class DetectionResultDTO {
  type: string;
  status: string;
  details: Record<string, any>;

  constructor(type: string, status: string, details: Record<string, any>) {
    this.type = type;
    this.status = status;
    this.details = details;
  }
}
