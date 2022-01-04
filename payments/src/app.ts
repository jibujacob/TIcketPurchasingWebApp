import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

import { errorHandler , NotFoundError } from "@jjtickets2021/common";
import { currentUser } from "@jjtickets2021/common";
import { createChargeRouter } from "./routes/new";

const app = express();
dotenv.config();

app.set("trust proxy",true);

app.use(express.json());
app.use(cookieSession({
    signed:false,
    secure: false,
}));
app.use(currentUser);

app.use(createChargeRouter);

app.all("*",async () => {
    throw new NotFoundError();  
})

app.use(errorHandler)

export {app}

