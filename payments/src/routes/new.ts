import express , {Request,Response} from "express";
import { body } from "express-validator";
import { Order } from "../models/orders";

import { stripe } from "../stripe";
import { BadRequestError, NotAuthoriedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@jjtickets2021/common";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post("/api/payments", 
    requireAuth,[
        body("token")
            .not()
            .isEmpty()
            .withMessage("Token not provided"),
        body("orderId")
            .not()
            .isEmpty()
            .withMessage("orderId not provided")
    ],
    validateRequest,
    async (req:Request,res:Response) => {
    
    const {token,orderId} = req.body;

    const order = await Order.findById(orderId);
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthoriedError();
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError("Cannot pay for a cancelled order");
    }
    
    const stripeCharge = await stripe.charges.create({
        currency:"inr",
        amount: order.price * 100,
        source: token,
        description:"Test"
    });

    const payment = Payment.build({
        orderId,
        stripeId: stripeCharge.id
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish(
        {
           id: payment.id,
           orderId:payment.orderId,
           stripeId:payment.stripeId
        }
    );

    res.status(201).send({id: payment.id});
});

export {router as createChargeRouter}