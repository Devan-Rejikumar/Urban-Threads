// import Product from "../../models/Products.js";

// const getProducts = async(req,res) =>{
//     try {
//         const products = await Product.find();
//         res.status(200).json(products)
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// }

// const addProduct = async ( req,res) =>{
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).json(product)
//     } catch (error) {
//         res.status(400).json({error:error.message})
//     }
// }

// const editProduct = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const product = await Product.findByIdAndUpdate(id, req.body, {new : true});
//         if(!product) return res.status(404).json({message : "Product not found"})
//             res.status(200).json(product);
//     } catch (error) {
//         res.status(400).json({error : error.message})
//     }
    
// }

// const deleteProduct = async (req,res) =>{
//     try {
//         const {id} = req.params;
//         const product = await Product.findByIdAndDelete(id);
//         if(!product) return res.status(404).json({message : "Product not found"});
//         res.status(200).json({message : "Product deleted succesfully"})
//     } catch (error) {
//         res.status(400).json({error:error.message})
//     }
// }

// export {getProducts,addProduct,editProduct,deleteProduct};

import Product from "../../models/Products.js";

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');  
        if (!products || products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
};


const addProduct = async (req, res) => {
    try {
        const { name, category, description, variants, images } = req.body;

        if (!variants || !Array.isArray(variants) || variants.length === 0) {
            return res.status(400).json({
                message: 'At least one variant is required',
                receivedVariants: variants
            });
        }

        const processedVariants = variants.map(variant => ({
            size: variant.size,
            color: variant.color,  
            stock: variant.stock,
        }));

        const newProduct = new Product({
            name,
            category,
            description,
            variants: processedVariants,
            images: images || [],
        });

        await newProduct.save();
        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).json({ error: error.message });
    }
};


const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: error.message });
    }
};


const softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDeleted } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, { isDeleted }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: `Product ${isDeleted ? 'deleted' : 'restored'} successfully`,
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error soft deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({ error: error.message });
    }
};

export { getProducts, addProduct, editProduct, softDeleteProduct, deleteProduct };
