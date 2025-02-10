'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext';
import AdminNavbar from './components/AdminNavbar';
import Stepper from './components/Stepper';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    sale: '',
    description: '',
    image: '',
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/adminlogin');
    }
  }, [router]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/adminlogin');
  };

  const handleChangePassword = () => {
    router.push('/adminlogin?step=update');
  };

  return (
    <div className="flex min-h-screen bg-gray-700">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-4 bg-blue-600 text-white fixed top-4 left-4 z-30 md:hidden"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full shadow-lg transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        } md:translate-x-0`}
      >
        <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 md:ml-64">
        {/* Admin Navbar */}
        <AdminNavbar handleLogout={handleLogout} handleChangePassword={handleChangePassword} />

        <div className="mt-8">
          {activeStep === 1 && (
            <ProductForm
              product={product}
              setProduct={setProduct}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setEditProductId={setEditProductId}
              setMessage={setMessage}
              message={message}
              loading={loading}
              setLoading={setLoading}
              addProduct={addProduct}
              updateProduct={updateProduct}
            />
          )}

          {activeStep === 2 && (
            <ProductList
              products={currentProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              handleEdit={(product) => {
                setProduct(product);
                setIsEditing(true);
                setEditProductId(product._id);
                setActiveStep(1);
              }}
              handleDelete={deleteProduct}
            />
          )}

          {activeStep === 3 && (
            <OrderList
              orders={orders}
              setOrders={setOrders}
              loadingOrders={loadingOrders}
              setLoadingOrders={setLoadingOrders}
              setMessage={setMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
