import express,{Request,Response} from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest ,NotFoundError,NotAuthoriedError} from "@jjtickets2021/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publishers";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

router.put("/api/tickets/:id", 
    requireAuth,
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Please provide Title"),
        body("price")
            .isFloat({gt:0})
            .withMessage("Price must be greater than zero")
    ],
    validateRequest,
    async (req:Request,res:Response) => {
        const ticketExists = await Ticket.findById(req.params.id);
        if(!ticketExists){
            throw new NotFoundError();
        }
         
        if(ticketExists.userId.toString() !== req.currentUser!.id){
            throw new NotAuthoriedError()
        }

        ticketExists.set({
            title:req.body.title,
            price:req.body.price,
        });

        await ticketExists.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id:ticketExists.id,
            title:ticketExists.title,
            price:ticketExists.price,
            userId : ticketExists.userId
        })
        
    res.status(200).send(ticketExists);
});

export {router as updateTicketRouter}