import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vandor.dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    const vandor = await Vandor.findOne({ email: email });
    return vandor;
  } else {
    const vandor = await Vandor.findById(id);
    return vandor;
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    return res.json({ message: "A vandor is exist with this email ID" });
  }

  //generating salt

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  //encrypting the pass using the salt

  const createdVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  return res.json(createdVandor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vandor.find();

  if (vandors !== null) {
    return res.json(vandors);
  }
  return res.json({ message: "Vandors data not available" });
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;

  const vandor = await FindVandor(vandorId);

  if (vandor !== null) {
    return res.json(vandor);
  }

  return res.json({ message: "Vandor data not available" });
};
