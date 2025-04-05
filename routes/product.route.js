// import express from "express";
// import { 
//     getAllProducts,
//     getFeaturedProducts,
//     getRecommendedProducts,
//     getProductByCategory,
//     createProduct,
//     toggleFeaturedProduct,
//     deleteProduct,
// } from "../controllers/product.controller.js";
// import upload from "../middleware/multerConfig.js"; // Import multer config
// import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

// // const router = express.Router();
// // const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });
// router.get("/", getAllProducts); //admin
// router.get("/featured", getFeaturedProducts);
// router.get("/category/:category", getProductByCategory);
// router.get("/recommendations", getRecommendedProducts); // admin
// router.post("/",upload.single("image") , createProduct); //admin
// router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); //admin
// router.delete("/:id", protectRoute, adminRoute, deleteProduct); //admin

// export default router ;

// // protectRoute, adminRoute

import express from "express";
import upload from "../middleware/multerConfig.js"; // Import multer config
import { 
    getAllProducts,
    getFeaturedProducts,
    getRecommendedProducts,
    getProductByCategory,
    createProduct,
    toggleFeaturedProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts); // Admin
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts); // Admin

// Use `upload.single("image")` for image upload
router.post("/", upload.single("image"), createProduct); // Admin

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // Admin
router.delete("/:id", protectRoute, adminRoute, deleteProduct); // Admin

export default router;
