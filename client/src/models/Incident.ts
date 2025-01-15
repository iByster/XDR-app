import Actor from "./Actor";
import Alert from "./Alert";
import Recommendation from "./Recommandation";
import Resource from "./Resource";

class Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  relatedEventId: number;
  recommendations: Recommendation[];
  alerts: Alert[];
  resources: Resource[];
  actors: Actor[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.severity = data.severity;
    this.relatedEventId = data.relatedEventId;
    this.recommendations = data.recommendations.map(
      (rec: any) => new Recommendation(rec)
    );
    this.alerts = data.alerts.map((rec: any) => new Alert(rec));
    this.resources = data.resources.map((rec: any) => new Resource(rec));
    this.actors = data.actors.map((rec: any) => new Actor(rec));
  }
}

export default Incident;
