import { Publisher, Subjects , TicketUpdatedEvent } from "@jjtickets2021/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject =  Subjects.TicketUpdated;
}