import express from "express";
import {getProducts, addProduct, editProduct, deleteProduct} from "../controllers/admin/productController.js";

const router = express.Router();

router.get("/", getProducts); 
router.post("/", addProduct); 
router.put("/:id", editProduct); 
router.delete("/:id", deleteProduct); 

export default router;
