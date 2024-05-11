const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsnycErros = require("../middlewares/catchAsnycErros");

// process stripe payment => /api/v1/payment/process
exports.processPayment = catchAsnycErros(async (req, res, next) => {
    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      payment_method_types: ['card']
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    });
});

// send stripe API Key => /api/v1/stripeapi
exports.sendStripeApi = catchAsnycErros(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});