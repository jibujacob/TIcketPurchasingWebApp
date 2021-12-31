import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";


const id = new mongoose.Types.ObjectId().toHexString();


it("Returns a 404 if the provided id does not exists" , async() =>  {
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title:"Title1",
            price:10
        })
        .expect(404);

});

it("Returns a 401 if the user is not autheticated" , async() =>  {
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:"Title1",
            price:10
        })
        .expect(401);

});

it("Returns a 401 if the user does not own the ticket" , async() =>  {
    const response = await request(app)
                .post("/api/tickets")
                .set('Cookie',global.signin())
                .send({
                    title: "title1",
                    price: 10
                }).expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title:"Title1",
            price:10
        })
        .expect(401);
});

it("Returns a 400 if the provides invalid title or price" , async() =>  {

    const cookie = global.signin();
    const response = await request(app)
                .post("/api/tickets")
                .set('Cookie',cookie)
                .send({
                    title: "title1",
                    price: 10
                }).expect(201);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:"Title1"
        })
        .expect(400);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:"Title1",
            price : -10
        })
        .expect(400);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            price:10
        })
        .expect(400);
});

it("Provided valid inputs and updated the ticket" , async() =>  {
    const cookie = global.signin()
    const response = await request(app)
                .post("/api/tickets")
                .set('Cookie',cookie)
                .send({
                    title: "title",
                    price: 10
                }).expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:"Title1",
            price:20
        })
        .expect(200);

    const getResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    
    expect(getResponse.body.title).toEqual("Title1");
    expect(getResponse.body.price).toEqual(20);
});

it("it publishes an event",async () =>{
    const cookie = global.signin()
    const response = await request(app)
                .post("/api/tickets")
                .set('Cookie',cookie)
                .send({
                    title: "title",
                    price: 10
                }).expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:"Title1",
            price:20
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})