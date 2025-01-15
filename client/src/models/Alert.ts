class Alert {
  id: number;
  title: string;
  description: string;
  severity: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.severity = data.severity;
    this.createdAt = data.createdAt;
  }
}

export default Alert;
