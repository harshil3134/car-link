import mongoose from "mongoose";

const renterSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    drivingLicenceNo: { 
        type: String, 
        required: true,
        trim:true,
     },
    contactNumber: { 
        type: String,
        required: true 
    }
},{timestamps:true})

export const Renter=new mongoose.model('Renter',renterSchema)