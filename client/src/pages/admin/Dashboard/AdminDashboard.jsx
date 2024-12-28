import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Outlet
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2 className='admin-heading'>Admin Dashboard</h2>
      
      {/* Sidebar */}
      <div className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="products" className="sidebar-link">Product</Link>
            </li>
            <li>
              <Link to="categories" className="sidebar-link">Category</Link>
            </li>
            <li>
              <Link to="users" className="sidebar-link">User Listing</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Outlet /> {/* This is where nested routes will render */}
        
      </div>
    </div>
  );
};

export default AdminDashboard;


// import React from 'react';
// import { Link, Outlet } from 'react-router-dom';
// import './AdminDashboard.css';
// import { LogOut as LogOutIcon } from 'lucide-react';

// const AdminDashboard = () => {
//   return (
//     <div className="admin-dashboard">
//       <h2 className='admin-heading'>Admin Dashboard</h2>
//       {/* Sidebar */}
//       <div className="sidebar">
//         <nav>
//           <ul>
//             <li>
//               <Link to="/admin/products" className="sidebar-link">Product</Link>
//             </li>
//             <li>
//               <Link to="/admin/categories" className="sidebar-link">Category</Link>
//             </li>
//             <li>
//               <Link to="/admin/users" className="sidebar-link">User Listing</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content Area */}
//       <div className="main-content">
//         <Outlet /> {/* This is where nested routes will render */}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
