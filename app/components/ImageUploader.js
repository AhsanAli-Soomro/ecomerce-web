// components/ImageUploader.js
import { useState } from 'react';

export default function ImageUploader({ onUpload }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Display preview
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_preset'); // Cloudinary preset

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onUpload(data.secure_url); // Send image URL to parent
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border border-gray-300 rounded-md p-2"
      />
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
      )}
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 rounded-md text-white ${uploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
