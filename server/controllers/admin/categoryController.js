// import Category from "../../models/Category.js";

// const getCategories = async(req,res) =>{
//     try {
//         const categories = await Category.find({isDeleted : false});
//         res.status(200).json(categories)
//     } catch (error) {
//         res.status(500).json({message:"Error fetching categories", error})
//     }
// }

// const addCategories = async(req,res) =>{
//     try {
//         const category = new Category({name : req.body.name});
//         await category.save();
//         res.status(200).json(category)
//     } catch (error) {
//         res.status(500).json({ message: "Error adding category", error });
//     }
// }

// const updateCategory = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const updateCategory = await Category.findByIdAndUpdate(id,req.body,{
//             new:true,
//         });
//         res.status(200).json(updateCategory)
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting category", error });
        
//     }
    
// };

// const deleteCategory = async (req,res) => {
//     try {
//         const {id} = req.params;
//         await Category.findByIdAndUpdate(id, {isDeleted : true},{new:true});
//         if(!Category){
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json({message :"Category deleted successfully"})
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting category", error });

//     }
    
// }

// export {getCategories,addCategories,updateCategory,deleteCategory}

import Category from "../../models/Category.js";

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const addCategories = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

export { getCategories, addCategories, updateCategory, deleteCategory };
