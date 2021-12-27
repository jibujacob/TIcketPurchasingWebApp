import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = () =>{
    return request(app)
            .post("/api/tickets")
            .set('Cookie',global.signin())
            .send({
                title: "title1",
                price: 10
            }).expect(201);
}

it("Can fetch list of tickets",async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    
    await createTicket();
    await createTicket();
    await createTicket();
    tickets = await Ticket.find({});
    const response = await request(app)
            .get("/api/tickets")
            .send().expect(200);

    expect(tickets.length).toEqual(response.body.length);
});

it("",async() => {

});