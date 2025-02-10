'use client';
import dynamic from 'next/dynamic';

// Dynamically import CartComponent to disable SSR
const CartComponent = dynamic(() => import('../components/CartComponent'), { ssr: false });

export default function CartPage() {
  return (
    <div className='pt-24'>
      <CartComponent />;
    </div>
  );
}
