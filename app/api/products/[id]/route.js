import connectDB from '../../../../lib/db';
import Product from '../../../../models/Product';
import { isValidObjectId } from 'mongoose';

export async function GET(req, { params }) {
  const { id } = params;
  await connectDB();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req, { params }) {
  const { id } = params; // Ensure the product ID is correct
  const { user, text } = await req.json(); // Get comment data from the request body

  await connectDB();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // Push the new comment into the product's comments array
    product.comments.push({ user, text });
    await product.save(); // Save the updated product with the new comment

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    await Product.findByIdAndDelete(id);
    return new Response('Product deleted', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
