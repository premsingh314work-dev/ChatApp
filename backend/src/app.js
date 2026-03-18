import express, { json } from 'express'
import dotenv from 'dotenv'
import authRouter from './routers/auth.route.js'
import messageRouter from './routers/messages.route.js'

dotenv.config()
const app =  express();
const PORT = process.env.PORT || 3000;

// app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRouter)
app.use('/api/messages',messageRouter)

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})
