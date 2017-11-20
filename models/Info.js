export class Info{
  constructor(name, tag){
    this.name = name;
    this.tag = tag || '';
    this.primaryItem = -1;
    this.items = [];
  }
}