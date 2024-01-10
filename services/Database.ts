import mongoose from "mongoose";
import { MONGO_URI } from "../config";

if (!MONGO_URI) {
  console.log("please define a MongoDB connection");
  process.exit(1);
}

export default async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "online_food_delivery_services",
    });

    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
