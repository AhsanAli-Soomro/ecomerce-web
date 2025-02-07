import connectDB from '../../../lib/db';
import Order from '../../../models/Order';

export async function GET() {
  await connectDB();
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function PATCH(request) {
  await connectDB();
  try {
    const { orderId, status } = await request.json();
    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
    if (!order) throw new Error('Order not found');
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB();
  try {
    const { orderId } = await request.json();
    await Order.findOneAndDelete({ orderId });
    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const data = await request.json();
    const newOrder = new Order(data);
    await newOrder.save();
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error('Error saving order:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

