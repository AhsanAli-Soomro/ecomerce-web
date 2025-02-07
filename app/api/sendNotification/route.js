import { NextResponse } from 'next/server';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Owner's phone and email
const ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER || '+OWNER_NUMBER';
const ownerEmail = process.env.OWNER_EMAIL || 'ahsanalisoomro147@gmail.com';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  await connectDB(); // Ensure DB connection
  let smsSent = true;
  let errorMessage = null;

  try {
    const {
      phone,
      orderId,
      email,
      name,
      totalQuantity,
      country,
      totalAmount,
      state,
      city,
      address,
      postalCode,
      userphone,
      cart,
    } = await request.json();

    // Save the order to the database
    await Order.create({
      orderId,
      name,
      email,
      userphone,
      address,
      city,
      state,
      country,
      postalCode,
      totalQuantity,
      totalAmount,
      cart,
    });

    // Construct SMS message for the customer
    const cartDetailsSMS = cart
      .map((item) => {
        const originalPrice = item.price.toFixed(2);
        const discountedPrice =
          item.sale > 0 ? (item.price - (item.price * item.sale) / 100).toFixed(2) : null;

        return discountedPrice
          ? `${item.name} (${item.category}) - $${discountedPrice} (${originalPrice} before) x ${item.quantity}`
          : `${item.name} (${item.category}) - $${originalPrice} x ${item.quantity}`;
      })
      .join('; ');

    const customerSMS = `
Order ID: ${orderId}
Name: ${name || 'Customer'}
Phone: ${userphone}
Address: ${address}, ${city}, ${state}, ${country}, ${postalCode}
Items: ${cartDetailsSMS}
Total Quantity: ${totalQuantity}
Total Amount: $${totalAmount.toFixed(2)}
Thank you for your order!
    `.trim();

    const ownerSMS = `
New Order Received:
Order ID: ${orderId}
Customer Name: ${name || 'Customer'}
Phone: ${userphone}
Email: ${email}
Shipping Address: ${address}, ${city}, ${state}, ${country}, ${postalCode}
Items Ordered:
${cart.map((item) => {
      const originalPrice = item.price.toFixed(2);
      const discountedPrice =
        item.sale > 0 ? (item.price - (item.price * item.sale) / 100).toFixed(2) : originalPrice;
      return `${item.name} (${item.category}) - ${discountedPrice} x ${item.quantity}`;
    }).join(', ')}
Total Quantity: ${totalQuantity}
Total Amount: $${totalAmount.toFixed(2)}
Payment Method: Cash on Delivery
    `.trim();

    // Send SMS to customer
    try {
      await client.messages.create({
        body: customerSMS,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: phone,
      });

      // Send SMS to owner
      await client.messages.create({
        body: ownerSMS,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: ownerPhoneNumber,
      });

    } catch (smsError) {
      console.error('Error sending SMS with Twilio:', smsError);
      smsSent = false;
      errorMessage = smsError.message || 'Twilio SMS failed';
    }

    // Construct email for the customer
    const cartDetailsHTML = cart
      .map((item) => {
        const originalPrice = item.price.toFixed(2);
        const discountedPrice =
          item.sale > 0 ? (item.price - (item.price * item.sale) / 100).toFixed(2) : null;

        const priceText = discountedPrice
          ? `<p>Original: $${originalPrice}, Discounted: $${discountedPrice} x ${item.quantity}</p>`
          : `<p>Price: $${originalPrice} x ${item.quantity}</p>`;

        return `
          <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-right: 20px;" />
            <div>
              <p><strong>${item.name}</strong> (${item.category})</p>
              ${priceText}
            </div>
          </div>
        `;
      })
      .join('');

    const emailHTML = `
     <h2>Order Confirmation - ${orderId}</h2>
      <p>Thank you for your order, ${name || 'Customer'}!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
      <h3>Shipping Address</h3>
      <p>${address}, ${city}, ${state}, ${country}, ${postalCode}</p>
      <h3>Order Details</h3>
      ${cartDetailsHTML}
      <p>We will notify you once your items are on the way. Thank you for shopping with us!</p>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation: ${orderId}`,
      html: emailHTML,
    });

    // Send email to owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: `New Order Received: ${orderId}`,
      html: `
        <h2>New Order Details - ${orderId}</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Customer Phone:</strong> ${userphone}</p>
        <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <h3>Shipping Address</h3>
        <p>${address}, ${city}, ${state}, ${country}, ${postalCode}</p>
        <h3>Order Items</h3>
        ${cartDetailsHTML}
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
      `,
    });

    // Return success message with SMS status
    if (smsSent) {
      return NextResponse.json({ message: 'Notifications sent successfully (SMS and Email)' });
    } else {
      return NextResponse.json({
        message: 'Email sent successfully, but SMS failed to deliver.',

        // error: errorMessage,
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification. Please try again later.' }, { status: 500 });
  }
}