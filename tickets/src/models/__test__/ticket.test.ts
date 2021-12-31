import { Ticket } from "../ticket";
import mongoose from "mongoose";
it("Implements ths optimal update concurrency",async () => {
    const id = new mongoose.Types.ObjectId();
    const ticket = await Ticket.build({
        title:"concert",
        price: 5,
        userId:id.toString()
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price:10});
    secondInstance!.set({price:15});

    await firstInstance!.save()

    try{
        await secondInstance!.save()
    }catch(err){
        return;
    }

    throw new Error("Should not come here")
});

it("Version incremented on saves", async()=>{
    const id = new mongoose.Types.ObjectId();
    const ticket = await Ticket.build({
        title:"concert",
        price: 5,
        userId:id.toString()
    });
    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})