import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js"
import ownerRoutes from "./routes/ownerRoutes.js"
import renterRoutes from "./routes/renterRoutes.js"
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials:true,
}))

//remove if ..
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

app.use(express.json({

}))
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))

app.use(cookieParser())

app.use("/api/v1/user",userRouter);

app.use("/api/v1/owner_reg",ownerRoutes);
app.use("/api/v1/renter_reg",renterRoutes);

app.use(errorMiddleware);

export {app}