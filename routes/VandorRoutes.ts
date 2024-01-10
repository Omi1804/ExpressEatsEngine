import express, { Request, Response, NextFunction } from "express";
import {
  Addfood,
  GetVandorProfile,
  GetFoods,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
  UpdateVendorCoverImage,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer"; //--> library used to uplode files

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

// router.use(Authenticate) --> we can also use authentication like this

router.post("/login", VandorLogin);

router.get("/profile", Authenticate, GetVandorProfile);

router.patch("/profile", Authenticate, UpdateVandorProfile);

router.patch("/service", Authenticate, UpdateVandorService);

router.patch("/coverimage", Authenticate, images, UpdateVendorCoverImage);

router.post("/food", Authenticate, images, Addfood);

router.get("/foods", Authenticate, GetFoods);

router.get("/", (req, res) => {
  res.json({ message: "Hello from Vandor" });
});

export { router as VandorRoute };
