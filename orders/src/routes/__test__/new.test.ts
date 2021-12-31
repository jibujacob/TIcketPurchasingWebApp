import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

import {natsWrapper} from "../../nats-wrapper";

it("Has a route handler listening to /api/orders for post requests", async () =>{
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const response =  await request(app)
            .post("/api/orders")
            .send({ticketId}); 
    expect(response.statusCode).not.toEqual(404);
});

it("Can be accessed only if the user is signed in", async () =>{
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .post("/api/orders")
            .send({ticketId})
            .expect(401);
});

it("Returns a status other than 401 if the user is signed in", async () =>{
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const response =  await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .send({ticketId}); 
    expect(response.statusCode).not.toEqual(401);
});

it("Returns an error if ticket details not provided", async ()=>{
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .expect(400);
});

it("Returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    
   await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .send({ticketId}).expect(404);
            
});

it("Returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        userId: "efwefwefwfw",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .send({ticketId:ticket.id}).expect(400);

});

it("Reserves the ticket", async () => {
    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });

    await ticket.save();

    await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .send({ticketId:ticket.id}).expect(201);
});

it("Emits an event on creation", async () => {
    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });

    await ticket.save();

    await request(app)
            .post("/api/orders")
            .set('Cookie',global.signin())
            .send({ticketId:ticket.id}).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
