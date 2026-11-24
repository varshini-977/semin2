import {Router} from 'express';
import Movie from '../models/Movie.js';
const router=Router();
router.get('/',async(req,res)=>{try{res.json(await Movie.find().sort({title:1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/',async(req,res)=>{try{const movie=await Movie.create(req.body);res.status(201).json(movie);}catch(e){res.status(400).json({message:e.message});}});
router.put('/:id',async(req,res)=>{try{const movie=await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!movie)return res.status(404).json({message:'Movie not found'});res.json(movie);}catch(e){res.status(400).json({message:e.message});}});
router.delete('/:id',async(req,res)=>{try{const movie=await Movie.findByIdAndDelete(req.params.id);if(!movie)return res.status(404).json({message:'Movie not found'});res.json({message:'Movie deleted'});}catch(e){res.status(400).json({message:e.message});}});
export default router;
