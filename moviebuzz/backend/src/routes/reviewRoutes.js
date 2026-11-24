import {Router} from 'express';
import Review from '../models/Review.js';
const router=Router();
router.get('/movie/:movieId',async(req,res)=>{try{res.json(await Review.find({movie:req.params.movieId}).sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/',async(req,res)=>{try{const review=await Review.create(req.body);res.status(201).json(review);}catch(e){res.status(400).json({message:e.message});}});
export default router;
