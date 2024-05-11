const router = require('express').Router();
const {isAuthenticated} = require('../middlewares/auth');
const {processPayment, sendStripeApi} = require('../controller/paymentController');

router.use(isAuthenticated);

router.post('/payment/process', processPayment);
router.get('/stripeapi', sendStripeApi);

module.exports = router;