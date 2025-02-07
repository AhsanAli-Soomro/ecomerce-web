import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    userphone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    cart: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
  });
  
  export default mongoose.models.Order || mongoose.model('Order', orderSchema);
  
