// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AdminLogin from './components/admin/AdminLogin.jsx';
// import AuthForm from './components/AuthForm';
// import AdminDashboard from './pages/admin/Dashboard/AdminDashboard.jsx';
// import CheckAuth from './components/ProtectedRoutes.jsx';
// import UserListing from './pages/admin/UserManagement/UserListing.jsx';
// import Product from './components/admin/Product.jsx';
// import Category from './components/admin/category/Category.jsx';


// function App() {
//   const isAuthenticated = true;  
//   const user = { role: 'admin' };  

//   return (
//     <Router>
//       <Routes>
//         <Route 
//           path="/user-auth" 
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AuthForm />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/admin-login" 
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminLogin />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/admin-dashboard" 
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminDashboard />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/" 
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AuthForm />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/admin/users" 
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <UserListing />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/admin/products"  
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <Product />
//             </CheckAuth>
//           }
//         />
//         <Route 
//           path="/admin/categories"  
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <Category />
//             </CheckAuth>
//           }
//         />
        
      
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AuthForm from './components/AuthForm';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard.jsx';
import CheckAuth from './components/ProtectedRoutes.jsx';
import UserListing from './pages/admin/UserManagement/UserListing.jsx';
import Product from './components/admin/Product.jsx';
import Category from './components/admin/category/Category.jsx';
import AddCategory from "./pages/admin/Category-Management/Add-Category.jsx";
import EditCategory from "./pages/admin/Category-Management/Edit-Category.jsx";

function App() {
  const isAuthenticated = true;  
  const user = { role: 'admin' };  

  return (
    <Router>
      <Routes>
        <Route path="/user-auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthForm /></CheckAuth>} />
        <Route path="/admin-login" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLogin /></CheckAuth>} />
        
        {/* Admin routes */}
        <Route path="/admin-dashboard" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminDashboard /></CheckAuth>}>
          <Route path="users" element={<UserListing />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
        </Route>

        <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthForm /></CheckAuth>} />
      </Routes>
    </Router>
  );
}

export default App;

