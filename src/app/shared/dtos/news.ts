import {SafeResourceUrl} from '@angular/platform-browser';

export class News {
  constructor(
    public id: number,
    public title: string,
    public summary: string,
    public text: string,
    public image: string,
    public imageURL: SafeResourceUrl,
    public publishedAt: string) {
  }
}
