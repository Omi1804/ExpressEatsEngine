import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from Vandor" });
});

export { router as VandorRoute };
