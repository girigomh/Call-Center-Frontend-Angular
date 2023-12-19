import {Location} from './location';
import {Seat} from './seat';
import {Sector} from './sector';

export class Hall {
  constructor(
    public id: number,
    public name: string,
    public location: Location,
    public seats: Seat[],
    public sectors: Sector[],
    public editingEnabled: boolean
  ) {}
}
