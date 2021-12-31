import { Publisher,Subjects,OrderCancelledEvent } from "@jjtickets2021/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;  
}
