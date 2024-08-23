const { varifyToken } = require("../helper/jwt");
const User = require("../model/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsnycErros = require("./catchAsnycErros");

exports.isAuthenticated = catchAsnycErros(async(req, res, next) => {
    console.log(req.cookies);
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    req.user = await User.findById(varifyToken(token).id);
    next();
});

// Handling user roles
exports.authorizeRoles = catchAsnycErros(async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(new ErrorHandler('Only admin can access this resource', 403));
    }
    next();
});
