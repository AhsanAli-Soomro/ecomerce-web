// app/api/cart/route.js
import connectDB from '../../../lib/db';
import Cart from '../../../models/Cart';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId'); // Get userId from query

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return new Response(JSON.stringify({ items: [] }), { status: 200 });

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
export async function POST(req) {
    await connectDB();
    const { userId, productId, quantity } = await req.json();
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity; // Update quantity
        } else {
          cart.items.push({ productId, quantity }); // Add new item
        }
      } else {
        cart = new Cart({
          userId,
          items: [{ productId, quantity }],
        });
      }
  
      await cart.save();
      const populatedCart = await cart.populate('items.productId').execPopulate(); // Ensure populated cart
  
      return new Response(JSON.stringify(populatedCart), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  

export async function DELETE(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId'); // Get productId from query
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return new Response('Cart not found', { status: 404 });
  
      cart.items = cart.items.filter((item) => !item.productId.equals(productId));
      await cart.save();
  
      return new Response(JSON.stringify(cart), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  
  
