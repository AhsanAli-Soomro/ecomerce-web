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
  const { id } = params;
  const { user, text } = await req.json();

  await connectDB();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    product.comments.push({ user, text });
    await product.save();

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const updatedData = await req.json();

  await connectDB();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // Update product fields
    Object.keys(updatedData).forEach((key) => {
      product[key] = updatedData[key];
    });

    await product.save(); // Save the updated product

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
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
