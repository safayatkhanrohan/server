const router = require('express').Router();
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require('../controller/productController');
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/admin/products', isAuthenticated, authorizeRoles, getAdminProducts);
router.post('/admin/product/new', isAuthenticated, authorizeRoles, newProduct);
router.get('/product/:id', getSingleProduct);
router.put('/review', isAuthenticated, createProductReview);
router.get('/reviews', getProductReviews)
router.delete('/admin/reviews', isAuthenticated, authorizeRoles, deleteReview);

router.route('/admin/product/:id')
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;