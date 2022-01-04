import mongoose from "mongoose";

import { app } from "./app";

const port = process.env.PORT || 5001;

const start = async () => {
    console.log("Starting up auth Services...");
    
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined")
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Auth Mongo DB");
        app.listen(port,()=>{
            console.log(`Auth Services listening on ${port}!!`);
        }); 
    } catch (error) {
        console.log(error);   
    }
}

start();

