import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmationEmail(booking, attraction) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Booking Confirmation - ${attraction.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2B6CB0;">Booking Confirmation</h2>
        <p>Dear ${booking.name},</p>
        <p>Thank you for your booking! Here are your booking details:</p>
        
        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2B6CB0; margin-top: 0;">Booking Information</h3>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Attraction Name:</strong> ${attraction.name}</p>
          <p><strong>Booking Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>Booking Time:</strong> ${booking.time}</p>
          <p><strong>Number of Adults:</strong> ${booking.adults}</p>
          <p><strong>Number of Children:</strong> ${booking.children}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        </div>

        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2B6CB0; margin-top: 0;">Payment Information</h3>
          <p>Please complete your payment through the following method:</p>
          <p><strong>Payment Method:</strong> Credit Card</p>
          <p>Please click the following link to complete payment:</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${booking._id}/payment" style="display: inline-block; padding: 10px 20px; background-color: #2B6CB0; color: white; text-decoration: none; border-radius: 4px;">Pay Now</a></p>
        </div>

        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2B6CB0; margin-top: 0;">Important Notes</h3>
          <ul>
            <li>Please confirm your trip 24 hours before departure</li>
            <li>If you need to cancel, please notify us 48 hours in advance</li>
            <li>Please bring valid identification documents</li>
          </ul>
        </div>

        <p>If you have any questions, please feel free to contact us.</p>
        <p>Have a wonderful trip!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
          <p style="color: #718096; font-size: 14px;">
            This email is automatically sent by the system, please do not reply directly.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent');
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
} 