import { OrderCancelledEvent, OrderStatus } from "@jjtickets2021/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () =>{
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    ticket.set({orderId})

    await ticket.save();

    const data : OrderCancelledEvent["data"] ={
        id: orderId,
        version: 0,
        ticket: {
            id:ticket.id
        }
    }

    // @ts-ignore
    const msg:Message ={
        ack:jest.fn()
    }

    return {listener,data,ticket,msg}
}

it("unsets the order Id of the ticket", async()=>{
    const {listener,data,ticket,msg} = await setup();
    
    await listener.onMessage(data,msg);
    const updatedticket = await Ticket.findById(ticket.id);
    
    expect(updatedticket!.orderId).toBeUndefined();
});

it("calls the ack message ", async()=>{
    const {listener,data,ticket,msg} = await setup();
    await listener.onMessage(data,msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event",async()=>{
    const {listener,data,ticket,msg} = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});