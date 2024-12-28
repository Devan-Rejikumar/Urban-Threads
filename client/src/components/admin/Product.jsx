import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Plus, Search, Filter, Edit, MoreVertical, Trash2, RefreshCw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from "../../pages/admin/Product-Management/Add-Products.jsx";
import EditProduct from "../../pages/admin/Product-Management/Edit-Products.jsx";
import BasicPagination from "../../pages/admin/Product-Management/BasicPagination.jsx";
import AdminBreadcrumbs from "../../pages/admin/Product-Management/AdminBreadcrumbs.jsx";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Products');
  const [selectedDate, setSelectedDate] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editTab, setEditTab] = useState(false);
  const [addTab, setAddTab] = useState(false);
  const actionMenuRefs = useRef({});
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/", { 
        withCredentials: true 
      });
      if (Array.isArray(response.data)) {
        setAllProducts(response.data);
        setProducts(response.data);
      } else {
        console.error('Invalid data format:', response.data);
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Fetch Products Error:', error);
      toast.error('Failed to load products');
    }
  };

  const filterProducts = (productList, searchTerm, filter, date) => {
    return productList.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const calculateEffectiveStock = (variants) => {
        return variants.reduce((total, variant) => total + (variant.stock || 0), 0);
      };

      const matchesFilter = 
        filter === 'All Products' || 
        (filter === 'In Stock' && !product.isDeleted && calculateEffectiveStock(product.variants) > 0) ||
        (filter === 'Out of Stock' && !product.isDeleted && calculateEffectiveStock(product.variants) === 0) ||
        (filter === 'Deleted' && product.isDeleted);

      const matchesDate = !date || 
        (new Date(product.createdAt).toDateString() === new Date(date).toDateString());

      return matchesSearch && matchesFilter && matchesDate;
    });
  };

  useEffect(() => {
    const filteredProducts = filterProducts(allProducts, searchQuery, activeFilter, selectedDate);
    setProducts(filteredProducts);
  }, [allProducts, searchQuery, activeFilter, selectedDate]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const toggleActionMenu = (productId) => {
    setOpenActionMenuId(openActionMenuId === productId ? null : productId);
  };

  const handleSoftDelete = async (product) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/softdeleteproduct/${product._id}`, 
        { isDeleted: !product.isDeleted },
        { withCredentials: true }
      );
      const updatedProducts = allProducts.map(prod => 
        prod._id === product._id 
          ? { ...prod, isDeleted: !prod.isDeleted } 
          : prod
      );
      setAllProducts(updatedProducts);
      setProducts(updatedProducts);
      toast.success(`Product ${product.isDeleted ? 'restored' : 'archived'} successfully`);
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditTab(true);
  };

  const calculateTotalStock = (variants) => {
    return variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!Object.values(actionMenuRefs.current).some(ref => ref && ref.contains(event.target))) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const pageCount = Math.ceil(products.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const renderContent = () => {
    if (addTab) {
      return (
        <>
          <AdminBreadcrumbs additionalCrumb="Add Product"/>
          <AddProduct 
            onSave={(newProduct) => {
              if (newProduct) {
                setAllProducts(prev => [...prev, newProduct]);
              }
              setAddTab(false);
            }} 
            onCancel={() => setAddTab(false)}
            onUpdateSuccess={fetchProducts}
          />
        </>
      );
    }

    if (editTab) {
      return (
        <>
          <AdminBreadcrumbs additionalCrumb="Edit Product"/>
          <EditProduct 
            product={selectedProduct} 
            onCancel={() => setEditTab(false)}
            onUpdateSuccess={fetchProducts}
          />
        </>
      );
    }

    return (
      <div className="product-dashboard">
        <div className="product-dashboard-header">
          <div className="product-header-left">
            <h1>Products</h1>
            <AdminBreadcrumbs/>
          </div>
          <div className="product-header-actions">
            <button className="btn btn-primary" onClick={() => setAddTab(true)}>
              <Plus size={16} className="mr-2" />
              Add New Product
            </button>
          </div>
        </div>

        <div className="product-search-bar">
          <div className="search-icon-wrapper">
            <Search size={16} className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search Product..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="product-filters-section">
          <div className="product-filter-tabs">
            {['All Products', 'In Stock', 'Out of Stock', "Deleted"].map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="product-filter-actions">
            <input
              type="date"
              className="date-picker"
              onChange={handleDateChange}
              value={selectedDate || ''}
            />
            <button className="btn btn-outline">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="product-customers-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Type</th>
                <th>Variants</th>
                <th>Stock Status</th>
                <th>Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-name">
                      {product.images[0] && (
                        <img src={product.images[0]} alt="" />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category?.name}</td>
                  <td>{product.type}</td>
                  <td>{product.brand || 'N/A'}</td>
                  <td>
                    <div className="variants-details">
                      {product.isDeleted ? (
                        <span className="text-primary">Product Archived</span>
                      ) : (
                        product.variants.map((variant, index) => (
                          <div key={index} className="variant-item mb-1">
                            <span className="font-semibold">Size: {variant.size}</span>
                            <span className="ml-2">Price: ${variant.price.toFixed(2)}</span>
                            <span className="ml-2 text-gray-600">Stock: {variant.stock}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`status-badge ${
                        product.isDeleted 
                          ? "deleted" 
                          : (calculateTotalStock(product.variants) > 0 
                            ? "active" 
                            : "blocked")
                      }`}
                    >
                      {product.isDeleted 
                        ? "N/A" 
                        : (calculateTotalStock(product.variants) > 0 
                          ? "Available" 
                          : "Out of Stock")
                      }
                    </span>
                  </td>
                  <td>{format(new Date(product.createdAt), 'dd MMM yyyy')}</td>
                  <td>
                    <div 
                      className="action-wrapper"
                      ref={(el) => actionMenuRefs.current[product._id] = el}
                    >
                      <div className="action-container">
                        <button 
                          className="action-menu-trigger"
                          onClick={() => toggleActionMenu(product._id)}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {openActionMenuId === product._id && (
                          <div className="action-dropdown">
                            <button className="dropdown-item" onClick={() => handleEdit(product)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </button>
                            <button 
                              className={`dropdown-item flex items-center ${product.isDeleted ? 'text-success' : 'text-danger'}`}
                              onClick={() => handleSoftDelete(product)}
                            >
                              {product.isDeleted ? (
                                <>
                                  <RefreshCw size={16} className="mr-2" />
                                  Restore
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} className="mr-2" />
                                  Archive
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="mt-6 flex justify-center">
            <BasicPagination count={pageCount} onChange={handlePageChange} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ 
          fontFamily: "serif",
          fontSize: '18px',
        }}
      />
    </>
  );
};

export default Products;


