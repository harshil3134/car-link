import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { owner_registration, vehicle_date, vehicle_detail_info, vehicle_registration } from "../controllers/ownerController.js";

const router=express.Router();

router.post("/owner_registration",isAuthenticated,owner_registration)
router.post("/vehicle_registration",isAuthenticated,vehicle_registration)
router.post("/vehicle_detail/:id",isAuthenticated,vehicle_detail_info)
router.post("/owner_home",isAuthenticated,vehicle_date)

export default router;