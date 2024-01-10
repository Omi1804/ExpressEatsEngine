import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.post("/vandor", CreateVendor);

router.get("/vandors", GetVendors);

router.get("/vandor/:id", GetVendorByID);

router.get("/", (req, res) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
