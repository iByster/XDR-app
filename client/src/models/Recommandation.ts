class Recommendation {
  id: number;
  title: string;
  description: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
  }
}

export default Recommendation;
