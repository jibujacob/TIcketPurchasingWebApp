import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../models/ticket";

const buildTickets = async () => {
    const ticket = Ticket.build({
        title:"concert",
        price: 20
    });
    return await ticket.save();

}
it("Fetches orders for a particular user", async() =>{
    const ticketOne = await buildTickets();
    const ticketTwo = await buildTickets();
    const ticketThree = await buildTickets();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticketOne.id}).expect(201);

    const {body: orderOne} = await request(app)
            .post("/api/orders")
            .set('Cookie',userTwo)
            .send({ticketId:ticketTwo.id}).expect(201);

    const {body: orderTwo} = await request(app)
            .post("/api/orders")
            .set('Cookie',userTwo)
            .send({ticketId:ticketThree.id}).expect(201);

    const response = await request(app)
            .get("/api/orders")
            .set('Cookie',userTwo)
            .expect(200);
    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
            
})
