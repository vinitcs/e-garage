import { Router } from "express";
import {
  getAllUsersData,
  loginAdmin,
  logoutAdmin,
  updateUserGarageStatus,
  verifyAdminAuthenticateToken,
} from "../controllers/admin.controller.js";
import adminAuthenticate from "../middlewares/adminAuthticate.js";

const router = Router();
router.route("/adminlogin").post(loginAdmin);
router
  .route("/verify-admin-token")
  .post(adminAuthenticate, verifyAdminAuthenticateToken);
//verify admin on refresh page to setting admin logged.

router.route("/adminlogout").post(logoutAdmin);

router.route("/allusersdata").get(adminAuthenticate, getAllUsersData);

router
  .route("/updateusergaragestatus/:id")
  .put(adminAuthenticate, updateUserGarageStatus);

export default router;
