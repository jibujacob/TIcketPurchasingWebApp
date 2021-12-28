import { Publisher, Subjects, TicketCreatedEvent } from "@jjtickets2021/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject =  Subjects.TicketCreated;
}