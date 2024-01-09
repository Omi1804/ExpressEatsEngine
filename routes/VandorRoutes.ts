import express, { Request, Response, NextFunction } from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// router.use(Authenticate) --> we can also use authentication like this

router.post("/login", VandorLogin);

router.get("/profile", Authenticate, GetVandorProfile);

router.patch("/profile", Authenticate, UpdateVandorProfile);

router.patch("/service", Authenticate, UpdateVandorService);

router.get("/", (req, res) => {
  res.json({ message: "Hello from Vandor" });
});

export { router as VandorRoute };
