import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controllers";

const router = express.Router();

// -------------- Signup/ Create Customer --------------//
router.post("/signup", CustomerSignup);

// -------------- Login --------------//
router.post("/login", CustomerLogin);

//authentication

// -------------- Verify Customer Account --------------//
router.patch("/verify", CustomerVerify);
// -------------- OTP/ Requesting OTP --------------//
router.get("/otp", RequestOtp);

// -------------- Profile --------------//
router.get("/profile", GetCustomerProfile);

router.patch("/profile", EditCustomerProfile);

//cart

//order

//payment
export { router as CustomerRoute };
