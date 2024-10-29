import connectDB from '../../../lib/db';
import Product from '../../../models/Product';

export async function POST(req) {
  await connectDB();

  try {
    const data = await req.json(); // This data includes the image URL
    console.log('Received product data:', data); // Debugging
    const newProduct = new Product(data);
    await newProduct.save();
    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Error saving product:', error); // Log the error
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
