import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@jjtickets2021/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
        const order = await Order.findOne(
            {
                _id: data.id,
                version: data.version - 1,
            }
        );
        //console.log("OrderCancelledListener>onMessage:",order);
        
        if(!order){
            throw new Error("Order not found");
        }

        order.set({status:OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }
    
}