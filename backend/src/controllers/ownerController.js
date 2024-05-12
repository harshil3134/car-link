import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {Owner} from "../models/owner.model.js"
import ErrorHandler from "../middlewares/error.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Renter } from "../models/renter.model.js";
import mongoose,{Types} from "mongoose";
import cloudinary from "cloudinary";
import { Available } from "../models/available.model.js";
import { Booking } from "../models/booking.model.js";


export const owner_registration=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,dob,aadharCardNo,contactNumber}=req.body;
    //to get user id
    const user=req.user;
    const user_id=user._id;

    if(user.role!="OWNER")
    {
    return next(new ErrorHandler("Invalid role", 400));
    }
//find user in owner by user id
    const isowner= await Owner.findOne({user:user_id});
  

    if (!firstName || !lastName || !dob || !aadharCardNo || !contactNumber) {
        return next(new ErrorHandler("Please fill full form!"),400);
      }
      if(isowner)
      {
        return next(new ErrorHandler("already in records"),400);
      }

      const owner=await Owner.create({
        user:req.user._id,
        firstName,
        lastName,
        dob,
        aadharCardNo,
         contactNumber
      })
    res.status(200).json(
        {
            success:true,
            message:'Owner registered'
        }
    )
})

export const vehicle_registration=catchAsyncErrors(async(req,res,next)=>{
const {carName,vehiclePlateNumber,pucNumber,rcBookNumber,validationDate}=req.body;

console.log(req.body);
 //to get user id
  const user=req.user;
  const user_id=user._id;

//find user in owner by user id
    const owner= await Owner.findOne({user:user_id});

//get owner id 
const owner_id=owner._id;



if(user.role!="OWNER")
{
return next(new ErrorHandler("Invalid role", 400));
}

if(!carName|| !vehiclePlateNumber || !pucNumber || !rcBookNumber || !validationDate)
{
return next(new ErrorHandler("Enter full form",400));
}

const vehicle=await Vehicle.create(
  {
    owner:owner_id,
    carName,
    vehiclePlateNumber,
    pucNumber,
    rcBookNumber,
    validationDate
  }
)
const id=vehicle._id
// const id="6603287c8a70516c4acf2d4b";

res.status(200).json(
  {
    success:true,
    vehicleid:id,
    message:"vehicle added"
   
  }
 
)
})

export const vehicle_date=catchAsyncErrors(async(req,res,next)=>{
  let {carname,startdate,enddate}=req.body;

    startdate=new Date(startdate);
    enddate=new Date(enddate);

     //to get user id
 const user=req.user;
 const user_id=user._id;

    if(user.role!="OWNER")
    {
    return next(new ErrorHandler("Invalid role", 400));
    }



//find user in owner by user id
   const owner= await Owner.findOne({user:user_id});
const owner_id=owner._id;
//find vehicle 
console.log("carname",carname)
const vehicle=await Vehicle.findOne({carName:carname})
const vehicle_id=vehicle._id;
const today = new Date();


console.log(startdate,enddate);

if(!startdate || !enddate)
{
return next(new ErrorHandler("please add both dates",400));
}
if (startdate < today || enddate < today || enddate <= startdate) {
  return next(new ErrorHandler("Please select valid dates.", 400));
}
const checkrecord=await Available.findOne({vehicle:vehicle_id})

if(!checkrecord)
{

  const dates=await Available.create(
    {
  vehicle:vehicle_id,
  startDate:startdate,
  endDate:enddate
    }
  )
}
else{
  const record_id=checkrecord._id;
  let s=await Available.findByIdAndUpdate(record_id, { startDate:startdate,endDate:enddate });
console.log("status ",s)
}

res.status(200).json(
  {
    success:true,
   message:"date succesfully set"
   
  }
)

})



export const vehicle_detail_info = catchAsyncErrors(async (req, res, next) => {
  const { segment, availableCity, fuelType, transmissionType, price } = req.body;

  console.log(req.body);
  //to get user id
  const user = req.user;
  const user_id = user._id;

  //find user in owner by user id
  const owner = await Owner.findOne({ user: user_id });

  //get vehicle id from frontend
  const { id } = req.params;

//get owner id 
const owner_id=owner._id;

console.log("id",id);
 const existing_vehicle=await Vehicle.findById(id);
 const moreInfo=existing_vehicle.moreInfo;
 console.log(req.body);

 const image=req.files.main_image;
console.log(image);

//clodinary code
if (!req.files || Object.keys(req.files).length === 0) {
  return next(new ErrorHandler("Image File Required!", 400));
}

if(!segment || !availableCity|| !fuelType || !transmissionType || !price)
{
return next(new ErrorHandler("fill full form",400));
}

// const { main_image,s_image_1,s_image_2,s_image_3,s_image_4} = req.files;

console.log("body ",req.body);

// const s_image_1=req.files.main_image[1];
// const s_image_2=req.files.main_image[2];
const listimg=["main_image","s_image_1","s_image_2","s_image_3","s_image_4"];

//loop throught each image
/////
////
let img;
let responses=[];
const allowedFormats = ["image/png", "image/jpeg", "image/webp","image/jpg"];
for (let i=0; i<listimg.length;i++){
 img=image[i];
  if(img)
  {
   
  



if (!allowedFormats.includes(img.mimetype)) {
  return next(
    new ErrorHandler("Invalid file type. Please upload a PNG or JPEG file.", 400)
  );
}
let cloudinaryResponse = await cloudinary.uploader.upload(
  img.tempFilePath
);

if (!cloudinaryResponse || cloudinaryResponse.error) {
  console.error(
    "Cloudinary Error:",
    cloudinaryResponse.error || "Unknown Cloudinary error"
  );
  return next(new ErrorHandler("Failed to upload Images to Cloudinary", 500));
}
responses.push(cloudinaryResponse.secure_url);
  }
}

listimg.forEach((key,index)=>{
  if(responses[index])
  {
    moreInfo[key]=responses[index];
    console.log("morreinfo.key",moreInfo.key,"key-",key,"and index",index);
  }

})




//upto here

 if(user.role!="OWNER")
 {
 return next(new ErrorHandler("Invalid role", 400));
 }

 if(!existing_vehicle){
  return next(new ErrorHandler("No vehicle exists",400));
 }



moreInfo.segment=segment;
moreInfo.availableCity=availableCity;
moreInfo.fuelType=fuelType;
moreInfo.transmissionType=transmissionType;
moreInfo.price=price;

const updated_vehicle=await existing_vehicle.save();

// await Vehicle.findByIdAndUpdate(id,{moreInfosegment});

res.status(200).json(
  {
    success:true,
    responses,
updated_vehicle,
message:"Vehicle successfully added with images"
   
  }
 
)

})
export const listcars=catchAsyncErrors(async(req,res,next)=>{
  const user=req.user;
 const user_id=user._id;
 let carlist=[];

//find user in owner by user id
   const owner= await Owner.findOne({user:user_id});
const owner_id=owner._id;

const vehicles=await Vehicle.find({owner:owner_id});
console.log(vehicles);
let carname;
for(let i=0;i<vehicles.length;i++)
{
carname=vehicles[i].carName;
carlist.push(carname);
}

res.status(200).json({
  success:true,
  carlist,
  message:"car list fetched"
})

})



export const fetchbookings=catchAsyncErrors(async(req,res,next)=>{
    //find user in owner by user id

  const imgarr=[];
    //to get user id
    const user=req.user;
    const user_id=user._id;
    let objarr=[];
    let mimg;
    if(user.role!="OWNER")
    {
    return next(new ErrorHandler("Invalid role", 400));
    }
    const owner = await Owner.findOne({ user: user_id });
    const owner_id=owner._id;

    const bookobj=await Booking.find({owner:owner})
    console.log(bookobj);


    for (let i = 0; i < bookobj.length; i++) {
      let vehicle=bookobj[i].vehicle;
      let renter=bookobj[i].renter;
      // let vehicleid=Mongoose.ObjectId(vehicle);
      const renterid=renter._id;
      const id=vehicle._id
      let startDate=new Date();
      let endDate=new Date();
      let bookedvehicle=await Vehicle.findById(id);
      const renter_ac=await Renter.findById(renterid);
      // console.log("eeeee",bookedvehicle);
      const firstName=renter_ac.firstName;
      const lastName=renter_ac.lastName;


      if(bookedvehicle)
      {
        console.log("veh",bookobj);
        startDate=bookobj[i].startDate;
        endDate=bookobj[i].endDate;
        const currentdate=new Date();
        console.log(currentdate)

        if(endDate>=currentdate)
        {

        

            let moreInfo=bookedvehicle.moreInfo;
          // console.log("moreinfo ",i,moreInfo);
  
           mimg=moreInfo.main_image;
  
      
         const obj={
          startDate:bookobj[i].startDate,
          endDate:bookobj[i].endDate,
          price:bookobj[i].price,
          mainimg:mimg,
          firstName:firstName,
          lastName:lastName
              }
          objarr.push(obj);
          console.log(startDate);
        }
      }
   
  }
  
    
  
   // Copy the original object and add a new property

    console.log(objarr);
    res.status(200).json({
      success:true,
 
      objarr,
      message:"bookings fetched"
    })
    
})