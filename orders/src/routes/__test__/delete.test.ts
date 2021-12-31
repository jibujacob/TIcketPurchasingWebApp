import { OrderStatus } from "@jjtickets2021/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";

it("Cancels the order", async() =>{ 
    const userOne = global.signin();

    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });
    await ticket.save();

    const {body:order} = await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticket.id}).expect(201);
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',userOne)
        .send()
        .expect(204)

    const updatedOrder = await Order.findById(order.id);
    
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("Returns Unauthorized access if user does not have accees to cancel particular order", async() =>{ 
    const userOne = global.signin();
    const userTwo = global.signin();

    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });
    await ticket.save();

    const {body:order} = await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticket.id}).expect(201);
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',userTwo)
        .send()
        .expect(401)
})

it("Emits an event on cancellation", async () => {
    const userOne = global.signin();

    const ticket = Ticket.build({
        title: "Title1",
        price: 20
    });
    await ticket.save();

    const {body:order} = await request(app)
            .post("/api/orders")
            .set('Cookie',userOne)
            .send({ticketId:ticket.id}).expect(201);
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',userOne)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})