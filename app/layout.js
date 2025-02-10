'use client';
import localFont from 'next/font/local';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ProductProvider } from '../contexts/ProductContext';
import Navbar from './components/Navbar';
import { CartProvider } from '@/contexts/CartContext';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';
import AdminNavbar from './admin/components/AdminNavbar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if current route is an admin-related route
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${
            isAdminPage ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'
          }`}
        >
          <ProductProvider>
            <CartProvider>
              {/* Conditional Navbar */}
              {isAdminPage ? <AdminNavbar /> : <Navbar />}

              {/* Main content area */}
              <div className={`${isAdminPage ? 'bg-gray-700' : 'bg-gray-100 px-6 pt-28'} min-h-screen`}>
                {children}
              </div>

              {/* Show footer only on non-admin pages */}
              {!isAdminPage && <Footer />}
            </CartProvider>
          </ProductProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
