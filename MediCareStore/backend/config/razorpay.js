const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new Error('Payment order creation failed');
  }
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expectedSignature === signature;
};

const fetchPayment = async (paymentId) => {
  try {
    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    throw new Error('Failed to fetch payment details');
  }
};

const refundPayment = async (paymentId, amount) => {
  try {
    return await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100)
    });
  } catch (error) {
    throw new Error('Refund failed: ' + error.message);
  }
};

module.exports = { razorpay, createOrder, verifyPaymentSignature, fetchPayment, refundPayment };
