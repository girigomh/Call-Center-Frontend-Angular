import {TicketStatus} from '../datatype/ticket_status';

export class TicketPost {
  constructor(
    public id: number,
    public show: number,
    public customer: number,
    public price: number,
    public seat: number,
    public sector: number,
    public status: TicketStatus) {
  }
}
