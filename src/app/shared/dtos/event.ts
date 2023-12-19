import {Artist} from './artist';
import {EventType} from '../datatype/event_type';

export class Event {
  constructor(
    public id: number,
    public name: string,
    public eventType: EventType,
    public description: string,
    public content: string,
    public artist: Artist,
    public durationInMinutes: number
  ) {}
}
