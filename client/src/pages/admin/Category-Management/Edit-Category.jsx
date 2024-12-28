import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './EditCategory.css';


const EditCategory = ({ category, onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!formData.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/categories/${category._id}`, 
        {
          name: formData.name,
          description: formData.description
        },
        { 
          withCredentials: true 
        }
      );

      toast.success('Category updated successfully');
      
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }
      setTimeout(() => {
        onCancel();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating category:', error);
      
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to update category');
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error updating category');
      }
    }
  };

  return (
    <div className="edit-category">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Type category name here..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Type category description here..."
            rows={6}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-submit">
            Submit
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;

