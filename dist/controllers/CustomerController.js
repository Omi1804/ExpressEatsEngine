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
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const utility_1 = require("../utility");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const existCustomer = yield models_1.Customer.findOne({
        email: email,
    });
    if (existCustomer != null) {
        return res
            .status(409)
            .json({ message: "An user exists with the provided email address" });
    }
    const result = yield models_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
        orders: [],
    });
    if (result) {
        //send the otp to the customer
        yield (0, utility_1.onRequestOtp)(otp, phone);
        //generate the signature
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });
        //send the result ot the client
        return res.status(201).json({
            signature: signature,
            veriffied: result.verified,
            email: result.email,
        });
    }
    return res.status(400).json({ message: "Error with Signup " });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInput, {
        validationError: { target: false },
    });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInput;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            //generate the signature
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            //send the result ot the client
            return res.status(201).json({
                signature: signature,
                veriffied: customer.verified,
                email: customer.email,
            });
        }
    }
    return res.status(404).json({ message: "Login Error" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email,
                });
            }
        }
    }
    return res.status(400).json({ message: "Error with OTP Validation " });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOtp)(otp, profile.phone);
            res
                .status(200)
                .json({ message: "OTP sent to your registered phone number" });
        }
    }
    return res.status(400).json({ message: "Error with OTP Validation " });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "Error with Fetch Profile" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
        validationError: { target: true },
    });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: "Error with Eidting Profile" });
});
exports.EditCustomerProfile = EditCustomerProfile;
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //grab current login customer
    const customer = req.user;
    if (customer) {
        //create an order ID
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield models_1.Customer.findById(customer._id);
        //Grab order items from request [{ id: XX , unit: XX }]
        const cart = req.body;
        let cartItems = Array();
        let netAmount = 0.0;
        //calculate order amount
        const foods = yield models_1.Food.find()
            .where("_id")
            .in(cart.map((item) => item._id))
            .exec();
        foods.map((food) => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        //create order with item description
        if (cartItems) {
            const currentOrder = yield Order_1.Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: "COD",
                paymentReponse: "",
                orderStatus: "Waiting",
            });
            if (currentOrder && profile) {
                profile.orders.push(currentOrder);
                yield (profile === null || profile === void 0 ? void 0 : profile.save());
                return res.status(200).json(currentOrder);
            }
        }
    }
    return res.status(400).json({ msg: "Error while Creating Order" });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ msg: "Orders not found" });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield models_1.Customer.findById(orderId).populate("items.food");
        if (order) {
            return res.status(200).json(order);
        }
    }
    return res.status(400).json({ msg: "Order not found" });
});
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map