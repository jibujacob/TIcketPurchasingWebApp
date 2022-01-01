import { OrderCreatedEvent, OrderStatus } from "@jjtickets2021/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const data : OrderCreatedEvent["data"] ={
        userId: ticket.userId,
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString(),
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id:ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg:Message ={
        ack:jest.fn()
    }

    return {listener,data,ticket,msg}
}

it("sets the order Id of the ticket", async()=>{
    const {listener,data,ticket,msg} = await setup();

    await listener.onMessage(data,msg);
    const updatedticket = await Ticket.findById(ticket.id);

    expect(updatedticket!.orderId).toEqual(data.id);
});

it("calls the ack message ", async()=>{
    const {listener,data,ticket,msg} = await setup();
    await listener.onMessage(data,msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updted event",async()=>{
    const {listener,data,ticket,msg} = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});