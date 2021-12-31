import { Publisher,Subjects,OrderCreatedEvent } from "@jjtickets2021/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;  
}

