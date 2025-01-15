class Resource {
  id: number;
  type: string;
  data: any;

  constructor(data: any) {
    this.id = data.id;
    this.type = data.type;
    this.data = data.data;
  }
}

export default Resource;
