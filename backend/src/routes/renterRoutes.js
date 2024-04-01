import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { bookcar, getcarinfo, getcars, renterRegistration } from "../controllers/renterController.js";

const router=express.Router();

router.post("/renter_registration",isAuthenticated,renterRegistration);
router.get("/getallvehicles",isAuthenticated,getcars);
router.get("/getcarinfo",isAuthenticated,getcarinfo);
router.post("/bookcar",isAuthenticated,bookcar);
export default router;
