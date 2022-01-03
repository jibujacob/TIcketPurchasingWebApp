import { NotAuthoriedError, NotFoundError, requireAuth } from "@jjtickets2021/common";
import express,{Request,Response} from "express";

import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders/:id",
    requireAuth,
    async (req:Request,res:Response) => {
    
    const order = await Order.findById(req.params.id)
            .populate("ticket");
    
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId.toString() !== req.currentUser!.id){
        throw new NotAuthoriedError();
    }

    res.send(order);
});

export {router as showOrderRouter}