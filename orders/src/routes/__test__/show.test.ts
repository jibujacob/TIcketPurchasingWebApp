import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches the order", async() =>{ 
    const userOne = global.signin();
    const id = new mongoose.Types.ObjectId()
    const ticket = Ticket.build({
        id:id.toString(),
        title: "Title1",
        price: 20
    });
    await ticket.save();

    const {body:order} = await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticket.id}).expect(201);
    
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',userOne)
        .expect(200)
})

it("Returns Unauthorized access if user does not have accees to fethc particular order", async() =>{ 
    const userOne = global.signin();
    const userTwo = global.signin();
    const id = new mongoose.Types.ObjectId()
    const ticket = Ticket.build({
        id:id.toString(),
        title: "Title1",
        price: 20
    });
    await ticket.save();

    const {body:order} = await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticket.id}).expect(201);
    
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',userTwo)
        .expect(401)
})