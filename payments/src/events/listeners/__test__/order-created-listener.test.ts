import { OrderCreatedEvent, OrderStatus } from "@jjtickets2021/common";
import mongoose from "mongoose";
import { Order } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created.listener"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data : OrderCreatedEvent["data"] = {
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString(),
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 20,
        }
    }

    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,data,msg};
}

it("Replicates the order info",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const order = await Order.findById(data.id);
    
    expect(order).toBeDefined();
    expect(order!.id).toEqual(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it("ack the message",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const order = await Order.findById(data.id);

    expect(msg.ack).toHaveBeenCalled();
});