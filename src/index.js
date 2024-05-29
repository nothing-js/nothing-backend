import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("mongo db connection failed");
})


/*
// first approch
import express from "express";

const app = express()

;( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on("erroer", (error) =>{
        console.log("ERROR");
       })

       app.listen(process.env.PORT, () => {
        console.log(`APP  is litening on port ${process.env.PORT}`);
       })

    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()*/

