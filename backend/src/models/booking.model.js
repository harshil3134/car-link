import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
renter:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Renter'
},
owner:{
type:mongoose.Schema.Types.ObjectId,
ref:'Owner'
},
vehicle:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Vehicle'
},
startDate:{
    type:Date,
    required:true
},
endDate:{
    type:Date,
    required:true
},
price:{
    type:Number,
    required:true
}
},{timestamps:true})

export const Booking=new mongoose.model('Booking',bookingSchema)