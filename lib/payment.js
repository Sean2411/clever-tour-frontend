import Stripe from 'stripe';

// Initialize payment service
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
      console.error('Stripe initialization failed:', error);
}

// Create payment
export async function createPayment({
  bookingId,
  amount,
  currency = 'usd',
  paymentMethod = 'credit'
}) {
  try {
    if (!stripe) {
      throw new Error('Payment service not properly initialized');
    }

    if (paymentMethod !== 'credit') {
      throw new Error('Unsupported payment method');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        bookingId
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Failed to create payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify payment
export async function verifyPayment(paymentIntentId) {
  try {
    if (!stripe) {
      throw new Error('Payment service not properly initialized');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      bookingId: paymentIntent.metadata.bookingId
    };
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 