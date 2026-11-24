import mongoose from 'mongoose';
const ticketSchema = new mongoose.Schema({
  movie:{type:mongoose.Schema.Types.ObjectId,ref:'Movie',required:true},
  customerName:{type:String,required:true},
  showDate:{type:String,required:true},
  ticketsCount:{type:Number,min:1,required:true},
  seatInfo:{type:String,default:''}
},{timestamps:true});
export default mongoose.model('Ticket',ticketSchema);
