const updateStock = require("../helper/updateStock");
const catchAsnycErros = require("../middlewares/catchAsnycErros");
const Order = require("../model/order");
const ErrorHandler = require("../utils/errorHandler");

// create new order => /api/v1/order/new
exports.newOrder = catchAsnycErros(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        order,
    });

});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsnycErros(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHandler("No order found with this ID", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsnycErros(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders,
    });
});

// Get all orders - ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsnycErros(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// Update / Process order - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsnycErros(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    console.log(order.orderItems[0].quantity);
    
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });
    
    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({
        success: true,
    });
}); 

// Delete order - ADMIN => /api/v1/admin/order/:id
exports.deleteOrder = catchAsnycErros(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new ErrorHandler("No order found with this ID", 404));
    }
    res.status(200).json({
        success: true,
    });
});
