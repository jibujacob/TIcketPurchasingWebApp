import { OrderCancelledEvent, OrderStatus } from "@jjtickets2021/common";
import { Order } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

import mongoose from "mongoose";

const setup = async () =>{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    })
    await order.save();
    //console.log(order);
    const data : OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        }
    }

    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,order,data,msg}
}

it("cancel the order placed", async () => {
    const {listener,order,data,msg} = await setup();
    await listener.onMessage(data,msg);
    
    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

});

it("ack the message", async () => {
    const {listener,order,data,msg} = await setup();
    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});