import express from 'express';
import cors from 'cors';



const app = express();

app.use(cors());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.get('/', (req,res)=>{
    res.send("running")
})

import userRoute from './routes/user.routes.js';
import chatRoute from './routes/chat.routes.js';


app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)

export default app;