const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsnycErros");
const APIFeatures = require("../utils/apiFeatures");
const catchAsnycErros = require("../middlewares/catchAsnycErros");
const cloudinary = require("cloudinary");

// create new product => /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    var imagesLinks = [];
    for(let i = 0; i < images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.user = req.user._id;
    req.body.images = imagesLinks;
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
            imagesLinks.forEach(async image => {
                await cloudinary.v2.uploader.destroy(image.public_id);
        });
        throw error;
    }
});

// get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 8;
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage);
    const products = await apiFeatures.query;
    const productsCount = await Product.countDocuments();

            res.status(200).json({
                success: true,
                products,
                productsCount,
                resPerPage,
            });
    
});

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
});

// get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
            const product = await Product.findById(req.params.id);
                res.status(200).json({
                    success: true,
                    product
                })
});

// update product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

        let product = await Product.findById(req.params.id);

        // check if user want to update images
        if(req.body.images){
            // delete prev images from cloudinary
            product.images.forEach(async image => {
                await cloudinary.v2.uploader.destroy(image.public_id);
            });
            // upload new images to cloudinary
            var images = [];
            for(let i = 0; i < req.body.images.length; i++){
                const result = await cloudinary.v2.uploader.upload(req.body.images[i], {
                    folder: "products",
                });
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            req.body.images = images;
        }
        
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true,});
        res.status(200).json({
            success: true,
            product
        });
        
});

// delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
        // delete images from cloudinary
        product.images.forEach(async image => {
            await cloudinary.v2.uploader.destroy(image.public_id);
        });

        await Product.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Product is deleted",
            });

});

// create new review => /api/v1/review
exports.createProductReview = catchAsnycErros(async (req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find( review => {
        return review.user.toString() === req.user._id.toString();
    });

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
    }
    
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// get product reviews => /api/v1/reviews
exports.getProductReviews = catchAsnycErros(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });

});

// delete review => /api/v1/admin/reviews
exports.deleteReview = catchAsnycErros(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    const review = product.reviews.find(review => review._id.toString() === req.query.reviewId.toString());

    product.reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString());
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews || 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
    
});