// models/Cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  items: [CartItemSchema], // Array of cart items
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
