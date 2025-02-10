'use client';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Helper function to shuffle products randomly
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const CategoryProducts = ({ category }) => {
    const { products } = useProducts(); // Get products from context
    const [filteredProducts, setFilteredProducts] = useState([]);
    const router = useRouter();

    // Filter, shuffle, and limit products to 5 whenever the category or products change
    useEffect(() => {
        let filtered = category
            ? products.filter((product) => product.category === category)
            : products;

        // Shuffle and limit to 5 products
        filtered = shuffleArray(filtered).slice(0, 5);
        setFilteredProducts(filtered);
    }, [category, products]);

    if (filteredProducts.length === 0) {
        return <p>No products found in this category.</p>;
    }

    const handleProductClick = (id) => {
        router.push(`/Product/${id}`);
    };

    return (
        <div className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product, index) => (
                <div
                    key={`${product._id}-${index}`}
                    onClick={() => handleProductClick(product._id)}
                    className="product-card bg-white shadow-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="relative">
                        <Image
                            width={500}
                            height={100}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                        />
                        {product.sale > 0 && (
                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                {product.sale}% OFF
                            </span>
                        )}
                    </div>

                    <div className="p-2">
                        <h2 className="text-sm font-bold text-gray-800">{product.name}</h2>
                        <p className="text-xs text-gray-500">
                            Price: <span className="text-gray-800">${product.price.toFixed(2)}</span>
                        </p>
                        {product.sale > 0 && (
                            <p className="text-xs text-yellow-500">
                                Sale Price: ${(product.price - (product.price * product.sale) / 100).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryProducts;
