// app/page.js
'use client';
import Link from 'next/link';
import Product from '../app/Product/page';
import LatestProductsScroll from './components/NewProducts';

export default function App() {
  return (
    <div className="px-4 pt-28">
      <Link href="/Product">
        <LatestProductsScroll />
      </Link>
      <Product />
    </div>
  );
}
