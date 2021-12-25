import express from "express";

const app = express()

app.use(express.json())

const port = process.env.PORT || 5001;

app.get('/',(req,res)=>{
    res.send("Hello")
})
app.get("/api/users/currentUser",(req,res) =>{
    console.log("Calling currentUser");
    res.send("Current User")
})

app.listen(port,()=>{
    console.log(`Auth Services listening on ${port}!!`);
});