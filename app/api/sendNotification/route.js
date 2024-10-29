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
    const { phone, orderId, email, name, totalQuantity, country, totalAmount,state, city, address, postalCode, userphone, cart } = await request.json();
    const cartDetails = cart
      .map(item => `• ${item.name} (${item.category}) - $${item.price} x ${item.quantity}`)
      .join('\n');
    const messageBody = name
      ? `Order from ${name} (Phone: ${userphone})\nOrder ID: ${orderId}\n${totalQuantity} item(s) from ${address}, ${city}, ${state}, ${country}, ${postalCode}.\nItems:\n${cartDetails}\nTotal Amount: $${totalAmount}`  
      : `Your order ${orderId} with ${totalQuantity} item(s) has been confirmed! Thank you for shopping with us.\nItems:\n${cartDetails}`;

    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Send Email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation: ${orderId}`,
      text: `Thank you for your order! Your order ID is ${orderId}.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
