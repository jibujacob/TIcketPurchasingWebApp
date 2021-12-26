import mongoose from "mongoose";

import { app } from "./app";

const port = process.env.PORT || 5001;

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined")
    }
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Connected to Auth Mongo DB");
        app.listen(port,()=>{
            console.log(`Auth Services listening on ${port}!!`);
        }); 
    } catch (error) {
        console.log(error);   
    }
}

start();

