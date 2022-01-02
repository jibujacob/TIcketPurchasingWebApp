import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@jjtickets2021/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            price: data.ticket.price,
            status: OrderStatus.Created
        });

        await order.save();

        msg.ack();
    }
    
}