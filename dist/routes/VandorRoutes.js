"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer")); //--> library used to uplode files
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
// router.use(Authenticate) --> we can also use authentication like this
router.post("/login", controllers_1.VandorLogin);
router.get("/profile", middlewares_1.Authenticate, controllers_1.GetVandorProfile);
router.patch("/profile", middlewares_1.Authenticate, controllers_1.UpdateVandorProfile);
router.patch("/service", middlewares_1.Authenticate, controllers_1.UpdateVandorService);
router.patch("/coverimage", middlewares_1.Authenticate, images, controllers_1.UpdateVendorCoverImage);
router.post("/food", middlewares_1.Authenticate, images, controllers_1.Addfood);
router.get("/foods", middlewares_1.Authenticate, controllers_1.GetFoods);
router.get("/", (req, res) => {
    res.json({ message: "Hello from Vandor" });
});
//# sourceMappingURL=VandorRoutes.js.map