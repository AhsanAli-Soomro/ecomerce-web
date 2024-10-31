import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID
  rating: { type: Number, required: true }, // Rating value
});

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User name or ID
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Timestamp of the comment
});


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  price: { type: Number, required: true },
  sale: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  ratings: [RatingSchema], // Array of ratings
  comments: [CommentSchema], // Array of comments
  // images: [{ type: String }],
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
