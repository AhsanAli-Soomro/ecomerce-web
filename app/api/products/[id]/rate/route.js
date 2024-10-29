import connectDB from '../../../../../lib/db';
import Product from '../../../../../models/Product';

export async function POST(req, { params }) {
  const { id } = params;
  const { userId, rating } = await req.json(); // Get user ID and rating

  await connectDB();

  try {
    const product = await Product.findById(id);

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // Check if the user has already rated this product
    const existingRating = product.ratings.find((r) => r.userId === userId);

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      product.ratings.push({ userId, rating });
    }

    await product.save();

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
