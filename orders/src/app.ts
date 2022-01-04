import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler , NotFoundError } from "@jjtickets2021/common";
import { currentUser } from "@jjtickets2021/common";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { showAllOrdersRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy",true);

app.use(express.json());
app.use(cookieSession({
    signed:false,
    secure: false,
}));
app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(showAllOrdersRouter);
app.use(deleteOrderRouter);

app.all("*",async () => {
    throw new NotFoundError();  
})

app.use(errorHandler)

export {app}