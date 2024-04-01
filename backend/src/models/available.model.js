import mongoose from "mongoose";

const availableSchema=new mongoose.Schema({
    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Vehicle',
        unique:true,
    },
    startDate:{
        type:Date,
        required:true,
        
    },
    endDate:{
        type:Date,
        required:true,
    }
},{timestamps:true})

export const Available=new mongoose.model('Available',availableSchema)