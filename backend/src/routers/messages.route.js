import express from 'express';

const messageRouter = express.Router();

messageRouter.get('/send',(req,res)=>{
    res.status(201).json({message:'message send'})
})
export default messageRouter;