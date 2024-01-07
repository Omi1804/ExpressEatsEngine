import express from "express";
import bodyParser from "body-parser";
import { AdminRoute, VandorRoute } from "./routes";
import mongoose from "mongoose";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/online_food_delivery_services";
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

if (!MONGO_URI) {
  console.log("please define a MongoDB connection");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    dbName: "online_food_delivery_services",
  })
  .then((result) => {
    console.log("DB connected");
  })
  .catch((err) => console.log("error" + err));

app.listen(8000, () => {
  console.log("App is listening on port 8000");
});
