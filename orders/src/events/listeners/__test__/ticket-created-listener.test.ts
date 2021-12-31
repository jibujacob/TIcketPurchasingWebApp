import { TicketCreatedEvent } from "@jjtickets2021/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

 

const setup = async () =>{
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data:TicketCreatedEvent["data"] ={
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,data,msg};
}

it("creates and saves a ticket", async () => {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const ticket = await Ticket.findById(data.id);
    console.log(ticket);
    
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it("ack the message", async () => {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const ticket = await Ticket.findById(data.id);
    console.log(ticket);

    expect(msg.ack).toHaveBeenCalled();
});