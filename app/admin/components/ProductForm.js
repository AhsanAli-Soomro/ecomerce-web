import React, { useState } from 'react';

export default function ProductForm({
    product,
    setProduct,
    isEditing,
    setIsEditing,
    setEditProductId,
    setMessage,
    message,
    loading,
    setLoading,
    addProduct,
    updateProduct,
}) {
    const [imageUploading, setImageUploading] = useState(false);

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ecomerce-web'); // Change to your Cloudinary preset if needed

        setImageUploading(true);
        setMessage('');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dodyzgste/image/upload', {
                method: 'POST',
                body: data,
            });

            const result = await res.json();
            if (res.ok && result.secure_url) {
                setProduct((prev) => ({ ...prev, image: result.secure_url }));
                setMessage('Image uploaded successfully!');
            } else {
                setMessage(`Image upload failed: ${result.error?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setMessage('Image upload failed: Network error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!product.name || !product.category || !product.subcategory || !product.price || !product.image) {
            setMessage('All fields are required');
            return;
        }

        if (isEditing) {
            updateProduct(product._id, product);
            setMessage('Product updated successfully!');
        } else {
            addProduct(product);
            setMessage('Product uploaded successfully!');
        }

        setProduct({ name: '', category: '', subcategory: '', price: '', sale: '', description: '', image: '' });
        setIsEditing(false);
        setEditProductId(null);
    };

    return (
        <div className="bg-gray-800 mt-16 p-8 shadow-md rounded-md">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-50">
                {isEditing ? 'Edit Product' : 'Upload Product'}
            </h1>
            {message && <p className="text-green-400 text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-gray-300 font-semibold">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={product.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="text-gray-300 font-semibold">Category</label>
                    <input
                        type="text"
                        name="category"
                        id="category"
                        value={product.category}
                        onChange={handleInputChange}
                        placeholder="Enter category"
                        required
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Subcategory */}
                <div className="flex flex-col">
                    <label htmlFor="subcategory" className="text-gray-300 font-semibold">Subcategory</label>
                    <input
                        type="text"
                        name="subcategory"
                        id="subcategory"
                        value={product.subcategory}
                        onChange={handleInputChange}
                        placeholder="Enter subcategory"
                        required
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Price */}
                <div className="flex flex-col">
                    <label htmlFor="price" className="text-gray-300 font-semibold">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={product.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        required
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Sale */}
                <div className="flex flex-col">
                    <label htmlFor="sale" className="text-gray-300 font-semibold">Sale (Optional)</label>
                    <input
                        type="number"
                        name="sale"
                        id="sale"
                        value={product.sale}
                        onChange={handleInputChange}
                        placeholder="Enter sale percentage"
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label htmlFor="description" className="text-gray-300 font-semibold">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        value={product.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        required
                        className="p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col">
                    <label htmlFor="image" className="text-gray-300 font-semibold">Upload Product Image</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                    />
                    {imageUploading && <p className="text-blue-400 mt-2">Uploading image...</p>}
                    {product.image && (
                        <div className="mt-4">
                            <img src={product.image} alt="Uploaded preview" className="h-32 w-32 object-cover rounded-md border border-gray-600" />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-semibold transition" ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
                            }`}
                    >
                        {isEditing ? 'Update Product' : 'Upload Product'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => {
                                setProduct({ name: '', category: '', subcategory: '', price: '', sale: '', description: '', image: '' });
                                setIsEditing(false);
                                setEditProductId(null);
                            }}
                            className="w-full bg-gray-600 text-white font-semibold py-3 rounded-md hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
