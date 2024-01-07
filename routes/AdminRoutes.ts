import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.post("/vendor", CreateVendor);

router.get("/vendors", GetVendors);

router.get("/vendor/:id", GetVendorByID);

router.get("/", (req, res) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
