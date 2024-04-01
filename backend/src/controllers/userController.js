import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.model.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const {  userName, email, password, role } = req.body;
  if (!userName || !email || !password) {
    return next(new ErrorHandler("Please fill full form.!!"),400);
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"),400);
  }
  const isuserName = await User.findOne({ userName });
  if (isuserName) {
    return next(new ErrorHandler("UserName already registered!"),400);
  }
  const user = await User.create({
    userName,
    email,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});

const sendToke = (user, statusCode, res, message,role) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Set httpOnly to true
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
    role,
  });
};


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password} = req.body;
  if (!email || !password ) {
    return next(new ErrorHandler("Please provide email and password "));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
 

  sendToke(user, 201, res, "User Logged In!",user.role);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getuser=catchAsyncErrors(async(req,res,next)=>{
  const user=req.user;

  res.status(200).json({
    success:true,
    user
  })
})



export const selectrole=catchAsyncErrors(async(req,res,next)=>{
  //get userName from JWT Token
  const userName=req.user.userName;
  //get role
  const role=req.body.role;
  //or write as const {role}=req.body;
  //find user in db
  const user = await User.findOne({ userName });
console.log("role ",role);
  if(!role)
  {
    return next(new ErrorHandler("Invalid or No role selected"),400);
  }
  if (!user) {
    return next(new ErrorHandler("Invalid UserName", 400));
  }

  if(role!="OWNER" && role!="RENTER")
  {

  return next(new ErrorHandler("Invalid role", 400));
  }
    // Find the user by ID and update the role
  await User.findByIdAndUpdate(user._id, { role });
  res.status(200).json({
    success:true,
    message:`Your role is successfully set to ${role}`
  })
})


