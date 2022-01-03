import request from "supertest";
import { app } from "../../app";

import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/orders";
import {stripe} from "../../stripe"
import { Payment } from "../../models/payments";
//jest.mock("../../stripe")

jest.setTimeout(60000)

it("returns a 404 when purchasing an order that does not exists", async() => {

    await request(app)
        .post("/api/payments")
        .set("Cookie",global.signin())
        .send({
            token:"abcde",
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async() => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie",global.signin())
        .send({
            token:"abcde",
            orderId: order.id
        })
        .expect(401);

});

it("returns a 400 when purchasing a cancelled order", async() => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userOne = global.signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie",userOne)
        .send({
            token:"abcde",
            orderId: order.id
        })
        .expect(400);  
});

it("returns a 201 with valid inputs", async () =>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userOne = global.signin(userId);
    const price = Math.floor(Math.random() * 1000)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: price,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie",userOne)
        .send({
            token:"tok_visa",
            orderId: order.id
        })
        .expect(201);

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0] ;
    
    // expect(chargeOptions.currency).toEqual("inr");
    // expect(chargeOptions.source).toEqual("tok_visa");

    const stripeCharges = await stripe.charges.list({limit:50});
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100
    });
    
    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({orderId:order.id,stripeId:stripeCharge!.id})

    expect(payment).not.toBeNull();
})

