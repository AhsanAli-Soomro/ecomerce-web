import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

export default function ProductList({
    products,
    currentPage,
    totalPages,
    setCurrentPage,
    handleEdit,
    handleDelete,
}) {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="p-8 shadow-md rounded-lg">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-50">Product List</h2>

            {products.length === 0 ? (
                <p className="text-gray-400 text-center">No products available.</p>
            ) : (
                <ul className="space-y-4">
                    {products.map((product) => (
                        <li
                            key={product._id}
                            className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                        >
                            {/* Product Info Section */}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-20 h-20 rounded-md object-cover border border-gray-600"
                                    />
                                </div>
                                <div>
                                    <strong className="text-lg font-semibold text-white">{product.name}</strong>
                                    <p className="text-sm text-gray-400">
                                        {product.subcategory} - {product.category}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Price: <span className="font-semibold text-white">Rs. {product.price}</span>
                                        {product.sale && (
                                            <span className="ml-2 text-red-400">({product.sale}% off)</span>
                                        )}
                                    </p>
                                    {product.description && (
                                        <p className="text-sm text-gray-500 mt-1">{product.description.substring(0, 60)}...</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                                >
                                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination Controls */}
            {products.length > 0 && (
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md text-gray-300 ${currentPage === 1
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-gray-300 font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md text-gray-300 ${currentPage === totalPages
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
