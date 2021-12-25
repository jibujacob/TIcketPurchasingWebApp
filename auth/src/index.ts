import express from "express";

const app = express()

app.use(express.json())

const port = process.env.PORT || 5001;

app.listen(port,()=>{
    console.log(`Auth Services listening on ${port}`);
});