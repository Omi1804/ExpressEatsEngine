"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFoods = exports.Addfood = exports.UpdateVandorService = exports.UpdateVendorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const Food_1 = require("../models/Food");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, AdminController_1.FindVandor)("", email);
    if (existingVandor != null) {
        //if not null then we validate and give access
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                name: existingVandor.name,
            });
            return res.json(signature);
            //now we had to save this signature to header file
        }
        else {
            return res.json({ message: "Password is not valid" });
        }
    }
    return res.json({ message: "Login creadential not valid" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ message: "Vandor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { foodType, name, address, phone } = req.body;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const saveResult = yield vendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
});
exports.UpdateVandorService = UpdateVandorService;
const Addfood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vandor != null) {
            //multer creates a directory file in req object like we have created user
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield Food_1.Food.create({
                vendorId: vandor._id,
                name: name,
                description: description,
                category: category,
                price: price,
                rating: 0,
                readyTime: readyTime,
                foodType: foodType,
                images: images,
            });
            vandor.foods.push(createdFood);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Something went wrong with add food" });
});
exports.Addfood = Addfood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        console.log(foods);
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Foods not found!" });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VandorController.js.map