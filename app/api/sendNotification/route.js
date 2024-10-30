import { NextResponse } from 'next/server';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

export async function POST(request) {
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

    // Construct SMS message with all relevant details
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

    // Construct the full SMS message
    const messageBody = `
Order ID: ${orderId}
Name: ${name || 'Customer'}
Phone: ${userphone}
Address: ${address}, ${city}, ${state}, ${country}, ${postalCode}
Items: ${cartDetailsSMS}
Total Quantity: ${totalQuantity}
Total Amount: $${totalAmount.toFixed(2)}
Thank you for your order!
    `.trim(); // Use trim to remove excess whitespace/newlines

    // Send SMS using Twilio
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890', // Fallback number
      to: phone,
    });

    // Construct HTML for the email
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

    // Send email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation: ${orderId}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);

    const errorMessage =
      error.response?.data?.message || 'Failed to send notification. Please try again later.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}



