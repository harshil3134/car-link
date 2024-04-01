import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Renter } from "../models/renter.model.js";
import ErrorHandler from "../middlewares/error.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Available } from "../models/available.model.js";
import { Booking } from "../models/booking.model.js";






export const renterRegistration=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,dob,drivingLicenceNo,contactNumber}=req.body;
    console.log(req.body);
    //to get user id
    const user=req.user;
    const user_id=user._id;

    if(user.role!="RENTER")
    {
    return next(new ErrorHandler("Invalid role", 400));
    }
    const isRenter= await Renter.findOne({user:user_id});
  

    if (!firstName || !lastName || !dob || !drivingLicenceNo || !contactNumber) {
        return next(new ErrorHandler("Please fill full form.."),400);
      }
      if(isRenter)
      {
        return next(new ErrorHandler("already in records"),400);
      }
      const renter=await Renter.create({
        user:req.user._id,
        firstName,
        lastName,
        dob,
        drivingLicenceNo,
         contactNumber
      })
      res.status(200).json(
        {
            success:true,
            message:'Renter registered',
            renter
        }
        
    )

})


export const getcars=catchAsyncErrors(async(req,res,next)=>{
    //to get user id
    const user = req.user;
    const user_id = user._id;
    const city = req.query.city;
    let startdate=req.query.startdate;
    let enddate=req.query.enddate;

    startdate=new Date(startdate);
    enddate=new Date(enddate);


    console.log("city",city);  
console.log("requesting for vehicles");
    const allvehicles = await Vehicle.find({'moreInfo.availableCity':city});
// console.log(allvehicles);
      let avialablevehicle=[]
    let vehicle_id;
    await Promise.all(allvehicles.map(async(v)=>{
       vehicle_id=v._id;
       let available=await Available.findOne({vehicle:vehicle_id});

       if(available)
        {
         // console.log("vehicle",available.startDate,available.endDate);
      
           if(available.startDate<=startdate && available.startDate<enddate && available.endDate>startdate && available.endDate>=enddate && startdate<enddate)
            {
                 avialablevehicle.push(v);
                //  console.log("avialable cars",avialablevehicle);
            }
        }

    }))
    
if(user.role!="RENTER")
{
return next(new ErrorHandler("Invalid role", 400));
}

    res.status(200).json(
      {
        success:true,
  avialablevehicle,

        message:"All AVIALABLE CARS"
       
      }
     
    )
})

export const getcarinfo=catchAsyncErrors(async(req,res,next)=>{
  const vehicleid=req.query.vehicleid;
  const vehicle=await Vehicle.findOne({_id:vehicleid});
  const user = req.user;
  const user_id = user._id;
  if(user.role!="RENTER")
{
return next(new ErrorHandler("Invalid role", 400));
}

  res.status(200).json({
    success:true,
    vehicle,
    message:"Vehicle Information Fetched"
  })
})

export const bookcar=catchAsyncErrors(async(req,res,next)=>{
  const {ownerid,vehicleid,startdate,enddate,price}=req.body;
console.log(req.body);

  const user = req.user;
  const user_id = user._id;

  const renter=await Renter.findOne({user:user_id})
  const renter_id=renter._id;
  if (!ownerid || !vehicleid || !startdate || !enddate || !price) {
    return next(new ErrorHandler("Please fill full form!"),400);
  }
  const booking=await Booking.create({
    renter:renter_id,
    owner:ownerid,
    vehicle:vehicleid,
    startDate:startdate,
    endDate:enddate,
    price:price,
  })
res.status(200).json({
success:true,
message:"vehicle booked successfully",
booking
})
})