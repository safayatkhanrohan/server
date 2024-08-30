const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const {createToken, varifyToken} = require("../helper/jwt");
const catchAsnycErros = require("../middlewares/catchAsnycErros");
const User = require("../model/user");
const sendMail = require("../helper/nodemailer");
const ErrorHandler = require("../utils/errorHandler");

// Register a new user => /api/v1/register
exports.registerUser = catchAsnycErros(async (req, res, next) => {
  if (!req.body.avatar) {
    return next(new ErrorHandler("Please upload an avatar", 400));
  }
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  
  const { name, email, password } = req.body;

    try {
      let user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
    } catch (error) {
      await cloudinary.v2.uploader.destroy(result.public_id);
      throw error;
    }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

// Login user => /api/v1/login

exports.loginUser = catchAsnycErros(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  let user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Password", 401));
  }

  const token = createToken(user._id);

  // cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }


  res.status(200).cookie('token', token, options).json({
    success: true,
    message: "User logged in",
  });

});

// Logout user => /api/v1/logout

exports.logoutUser = catchAsnycErros(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsnycErros(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave: false});

  // create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const mailOptions = {
    from: 'noreply@shopit.com',
    to: email,
    subject: "Password Recovery",
    text: "reset your password with this link",
    html: `<p>Reset your password by clicking the follwing link</p>
          <a href="${resetUrl}">${resetUrl}</a>`
};
  try {
    sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: `Email sent to: ${email}`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave: false});
    return next(new ErrorHandler(error.message, 500));
  }

});

// Reset password => /api/v1/password/reset/:token

exports.resetPassword = catchAsnycErros(async (req, res, next) => {
  // hash url token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  });
  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsnycErros(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update / change password => /api/v1/password/update
exports.updatePassword = catchAsnycErros(async (req, res, next) => {
  const user = await User.findById(req.user.id, {password: 1});
  const isMatched = await bcrypt.compare(req.body.oldPassword, user.password);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully"
  });
});

// update user profile => /api/v1/me/update
exports.updateProfile = catchAsnycErros(async (req, res, next) => {
  const {name, email, avatar} = req.body;
  const newUserData = {
    name,
    email
  };

  // update avatar
  if (avatar) {
    const user = await User.findById(req.user.id);
    const image_id = user.avatar.public_id;
    // delete user previous avatar
    const res = await cloudinary.v2.uploader.destroy(image_id);
    const result = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully"
  });
});

// get all users => /api/v1/admin/users
exports.allUsers = catchAsnycErros(async (req, res, next) => {
  const users = await User.find({_id: {$ne: req.user.id}});
  res.status(200).json({
    success: true,
    users,
  });
});

// get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsnycErros(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsnycErros(async (req, res, next) => {
  const {isAdmin, name} = req.body;
  const updateOption = {
    isAdmin,
    name
  };
  const user = await User.findByIdAndUpdate(req.params.id, updateOption, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "User updated successfully"
  });
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsnycErros(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
  }
  // remove avatar from cloudinary
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await User.findByIdAndDelete(user._id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});