import {Router} from 'express';
import Ticket from '../models/Ticket.js';
const router=Router();
router.get('/',async(req,res)=>{try{res.json(await Ticket.find().populate('movie','title').sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/',async(req,res)=>{try{const ticket=await Ticket.create(req.body);res.status(201).json(ticket);}catch(e){res.status(400).json({message:e.message});}});
export default router;
