import mongoose from "mongoose";

import { app } from "./app";

const port = process.env.PORT || 5001;

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined")
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Tickets Mongo DB");
        app.listen(port,()=>{
            console.log(`Tickets Services listening on ${port}!!`);
        }); 
    } catch (error) {
        console.log(error);   
    }
}

start();

