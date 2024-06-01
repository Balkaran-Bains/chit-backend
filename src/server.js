import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from './config/index.js';

dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Surver is running at port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDb connection failed", error);
})