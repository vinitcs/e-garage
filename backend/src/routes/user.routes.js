import { Router } from "express";
import {
  createUser,
  deleteUser,
  loggedUser,
  loginUser,
  logoutUser,
  updateUser,
  verifyJwtToken,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();
router.route("/userregister").post(createUser);

router.route("/userlogin").post(loginUser);

router.route("/verify-token").post(authenticate, verifyJwtToken);
//verify user on refresh page to setting user logged.

router.route("/loggeduser").get(authenticate, loggedUser);

router.route("/userlogout").post(authenticate, logoutUser);
router.route("/userupdate").put(authenticate, updateUser);
router.route("/userdelete/:id").delete(authenticate, deleteUser);

export default router;
