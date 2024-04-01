import mongoose from "mongoose";

const ownerSchema=new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
},
firstName:{
    type:String,
    required:[true,"please provide first name"],
    trim:true,
},
lastName:{
    type:String,
    required:[true,"please provide last name"],
    trim:true,
},
dob:{
    type:Date,
    required:[true,"please provide date"],
},
aadharCardNo: { 
    type: String, 
    required:[true,"please provide Addhar card no"],
    validate: {
        validator: function(v) {
            return v.length === 12; // Check if the length is exactly 12
        },
        message: 'Addhar Card No Must Be Exactly 12 characters long.'
    },
    trim:true,
 },
contactNumber: { 
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            return v.length === 10; // Check if the length is exactly 10
        },
        message: 'Contact No Must Be Exactly 10 characters long.'
    },
}

},{timestamps:true})

export const Owner=mongoose.model('Owner',ownerSchema)