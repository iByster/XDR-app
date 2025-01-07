import Recommendation from "./Recommandation";

class Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  relatedEventId: number;
  recommendations: Recommendation[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.severity = data.severity;
    this.relatedEventId = data.relatedEventId;
    this.recommendations = data.recommendations.map(
      (rec: any) => new Recommendation(rec)
    );
  }
}

export default Incident;
