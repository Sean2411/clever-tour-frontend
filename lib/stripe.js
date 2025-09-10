import { loadStripe } from '@stripe/stripe-js';

// 获取 Stripe 发布密钥
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

// 加载 Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export default getStripe;
