import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@jjtickets2021/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publishers";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose"

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        
        //console.log(new mongoose.mongo.ObjectId(data.id));
        const ticket = await Ticket.findById(data.ticket.id);
        // console.log("order-cancaelled-listener>ticket:",ticket);
        
        if(!ticket){
            throw new Error("Ticket not found");
        }

        ticket.set({orderId: undefined});
        await ticket.save();
        
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price, 
            userId: ticket.userId, 
            version: ticket.version, 
            orderId: ticket.orderId 
        });
        
        msg.ack();
    }

}