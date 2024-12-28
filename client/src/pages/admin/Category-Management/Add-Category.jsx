// import React, { useState } from 'react';
// import axios from 'axios';
// // import './Category.css';
// import { useNavigate } from 'react-router-dom';

// const AddCategory = () => {
//     const [name, setName] = useState('');
//     const [image, setImage] = useState(null);
//     const navigate = useNavigate();

//     // Move handleSubmit inside the component
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('name', name);
//         if (image) {
//             formData.append('image', image);
//         }
//         try {
//             await axios.post('/api/categories', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             navigate('/admin/Category-Management');
//         } catch (error) {
//             console.error('Error adding category', error);
//         }
//     };

//     return (
//         <div className='category-container'>
//             <h1 className='category-title'>Add New Category</h1>
//             <form onSubmit={handleSubmit} className='category-form'>
//                 <div className='form-group'>
//                     <label htmlFor='name'>Category Name:</label>
//                     <input
//                         type='text'
//                         id='name'
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                     />
//                 </div>
//                 <div className='form-group'>
//                     <label htmlFor='image'>Category Image:</label>
//                     <input
//                         type='file'
//                         id='image'
//                         onChange={(e) => setImage(e.target.files[0])}
//                         accept='image/*'
//                     />
//                 </div>
//                 <button type='submit' className='button'>Add Category</button>
//             </form>
//         </div>
//     );
// };

// export default AddCategory;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = ({ onSave, onCancel, onUpdateSuccess }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: categoryName.trim(),
        description: description.trim() || '', 
        isActive: true 
      };
      const response = await axios.post('http://localhost:5000/api/categories', payload, {
        withCredentials: true
      });
      toast.success('Category created successfully');
      onSave(response.data);
      onUpdateSuccess();
     
      setTimeout(() => {
        onCancel();
      }, 2000);
        
    } catch (error) {
      console.error('Category creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');  
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Adding data...</div>;
  }

  return (
    <div className="add-category">
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Type category name here..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type category description here..."
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-submit">Submit</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;


