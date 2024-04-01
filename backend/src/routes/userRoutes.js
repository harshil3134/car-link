import express from "express";
import { getuser, login, logout, register, selectrole } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/logout",isAuthenticated,logout)
router.put("/selectrole",isAuthenticated,selectrole)
router.get("/getuser",isAuthenticated,getuser)

export default router;