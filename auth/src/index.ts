import express from "express";
import "express-async-errors";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";

const app = express();

app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*",async () => {
    throw new NotFoundError();  
})

app.use(errorHandler)
const port = process.env.PORT || 5001;

const start = async () => {
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

