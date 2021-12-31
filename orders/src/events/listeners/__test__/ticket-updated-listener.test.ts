import { TicketUpdatedEvent } from "@jjtickets2021/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

 

const setup = async () =>{
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toString(),
        title: "concert",
        price: 10
    });
    await ticket.save();
    

    const data:TicketUpdatedEvent["data"] ={
        id: ticket.id,
        title: "concert1",
        price: 20,
        userId: new mongoose.Types.ObjectId().toString(),
        version: ticket.version + 1
    }

    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,data,ticket,msg};
}

// it("creates and updates a ticket", async () => {
//     const {listener,data,ticket,msg} = await setup();
    
//     await listener.onMessage(data,msg);
//     const updatedTicket = await Ticket.findById(ticket.id);
    
//     expect(updatedTicket).toBeDefined();
//     expect(updatedTicket!.title).toEqual(data.title);
//     expect(updatedTicket!.price).toEqual(data.price);
//     expect(updatedTicket!.version).toEqual(data.version);
// });

// it("ack the message", async () => {
//     const {listener,data,msg} = await setup();
//     await listener.onMessage(data,msg);
//     // const ticket = await Ticket.findById(data.id);
//     expect(msg.ack).toHaveBeenCalled();
// });

it('does not call ack if the evnt has skipped version number',async() => {
    const {listener,data,ticket,msg} = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data,msg);
    } catch (error) {
        
    } 
    expect(msg.ack).not.toHaveBeenCalled();


});