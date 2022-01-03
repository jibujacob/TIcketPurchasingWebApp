import express,{Request,Response} from "express";
import {body} from "express-validator";
import mongoose from "mongoose"

import { BadRequestError, NotFoundError,requireAuth,validateRequest ,OrderStatus} from "@jjtickets2021/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/api/orders",
        requireAuth,[
            body("ticketId")
                .not()
                .isEmpty()
                .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
                .withMessage("Ticket Id must be provided")
        ],
        validateRequest,
        async (req:Request,res:Response) => {
    
    const ticket = await Ticket.findById(req.body.ticketId);
    if(!ticket){
        throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId : req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();
    
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        }
    })
    res.status(201).send(order);
});

export {router as createOrderRouter}