"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
// -------------- Signup/ Create Customer --------------//
router.post("/signup", controllers_1.CustomerSignup);
// -------------- Login --------------//
router.post("/login", controllers_1.CustomerLogin);
//authentication (use here so that all functions below it can use this authentication)
router.use(middlewares_1.Authenticate);
// -------------- Verify Customer Account --------------//
router.patch("/verify", controllers_1.CustomerVerify);
// -------------- OTP/ Requesting OTP --------------//
router.get("/otp", controllers_1.RequestOtp);
// -------------- Profile --------------//
router.get("/profile", controllers_1.GetCustomerProfile);
router.patch("/profile", controllers_1.EditCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map