import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  genre:{type:String,required:true},
  director:{type:String,required:true},
  releaseYear:{type:Number,required:true},
  rating:{type:Number,min:0,max:10,default:0},
  description:{type:String,default:''},
  poster:{type:String,default:''}
},{timestamps:true});
export default mongoose.model('Movie',movieSchema);
