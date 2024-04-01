import mongoose from "mongoose";


const vehicle_detail_info=new mongoose.Schema({
main_image:{
    type:String,
    default:" "
},
s_image_1:{
    type:String,
    default:" "
},
s_image_2:{
    type:String,
    default:" "
},
s_image_3:{
    type:String,
    default:" "
},
s_image_4:{
    type:String,
    default:" "
},
segment:{
type:String,
default:" "
},


availableCity:{
type:String,
default:" "
},
fuelType:{
    type:String,
    default:" "
},
transmissionType:{
    type:String,
    default:" "
},
price:{
    type:Number,
    default:100,
    minLength:[3,"minimum price should be 100Rs"],
    maxLength:[8,"exceeds max price limit"]
}
})



const vehicleSchema=new mongoose.Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Owner"
},
carName:{
type:String,
required:[true,"please provide car name"],
maxLength:[40,"invalid car name length"]
},
vehiclePlateNumber:{
    type:String,
    required:[true,"please provide vehicle number plate"],
    validate: {
        validator: function(v) {
            return (v.length > 7 && v.length < 11); // Check if the length is 8 or 9
        },
        message: 'Vehicle Plate No Must Be Between 8 and 11 characters long.'
    },
    unique:[true,"This Vehicle Number Plate is already registered"],
},
pucNumber:{
    type:String,
    required:[true,"please provide PUC Number"],
    validate: {
        validator: function(v) {
            return v.length === 16; // Check if the length is exactly 16
        },
        message: 'PUC No Must Be Exactly 16 characters long.'
    },
    unique:[true,"This PUC Number is already registered"],
},
rcBookNumber:{
    type:String,
    required:[true,"please provide RC Book Number"],
    validate: {
        validator: function(v) {
            return v.length === 10; // Check if the length is exactly 10
        },
        message: 'RC Book Must Be Exactly 10 characters long.'
    },
    unique:[true,"This Rc Book is already registered"],
},
validationDate:{
type:Date,
required:true,
},

moreInfo:{
    main_image:{
        type:String,
        default:" "
    },
    s_image_1:{
        type:String,
        default:" "
    },
    s_image_2:{
        type:String,
        default:" "
    },
    s_image_3:{
        type:String,
        default:" "
    },
    s_image_4:{
        type:String,
        default:" "
    },
    segment:{
    type:String,
    default:" "
    },
    
    
    availableCity:{
    type:String,
    default:" "
    },
    fuelType:{
        type:String,
        default:" "
    },
    transmissionType:{
        type:String,
        default:" "
    },
    price:{
        type:Number,
        default:100,
        minLength:[3,"minimum price should be 100Rs"],
        maxLength:[8,"exceeds max price limit"]
    }
    }

},{timestamps:true})

export const Vehicle=new mongoose.model('Vehicle',vehicleSchema)