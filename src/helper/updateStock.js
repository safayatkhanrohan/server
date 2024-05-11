const Product = require("../model/productModel");

const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    product.countInStock = product.countInStock - quantity;
    await product.save({ validateBeforeSave: false });
}

module.exports = updateStock;