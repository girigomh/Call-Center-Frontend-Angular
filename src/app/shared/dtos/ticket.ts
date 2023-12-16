import {Show} from './show';
import {Customer} from './customer';
import {Seat} from './seat';
import {Sector} from './sector';
import {TicketStatus} from '../datatype/ticket_status';

export class Ticket {
  constructor(
    public id: number,
    public reservationNo: string,
    public show: Show,
    public customer: Customer,
    public price: number,
    public seat: Seat,
    public sector: Sector,
    public status: TicketStatus) {
  }
}
