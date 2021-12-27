import request from "supertest"
import { app } from "../../app";
import mongoose from "mongoose"

it("returns a 404 if the ticket is not found", async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
}); 

it("returns the ticket if found", async()=>{
    
    const title ="title";
    const response = await request(app)
            .post("/api/tickets")
            .set('Cookie',global.signin())
            .send({
                title,
                price: 10
            }).expect(201);
    
    const idCreated = response.body.id;
    
    const getResponse = await request(app)
        .get(`/api/tickets/${idCreated}`)
        .send()
        .expect(200);
            
    expect(getResponse.body.id).toEqual(idCreated);
}); 