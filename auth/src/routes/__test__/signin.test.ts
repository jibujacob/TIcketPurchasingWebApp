import request from "supertest";
import {app} from "../../app";

it("fails when an email that does not exist is supplied" , async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email:"test@abc.com",
            password:"password"
        }).expect(400);
});

it("fails when an password does not match" , async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@abc.com",
            password:"password"
        }).expect(201);
    
    await request(app)
        .post("/api/users/signin")
        .send({
            email:"test@abc.com",
            password:"password1"
        }).expect(400);
});

it("fails when an password does not match" , async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@abc.com",
            password:"password"
        }).expect(201);
    
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email:"test@abc.com",
            password:"password"
        }).expect(200);
    
    expect(response.get("Set-Cookie")).toBeDefined();
    
});
