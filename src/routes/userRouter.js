const { 
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword, 
    allUsers,
    getUserDetails,
    updateProfile,
    updateUser,
    deleteUser} = require('../controller/userController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.get('/logout', isAuthenticated, logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/me/update', isAuthenticated, updateProfile);
router.get('/me', isAuthenticated, getUserProfile);
router.put('/password/update', isAuthenticated, updatePassword);
router.get('/admin/users', isAuthenticated, authorizeRoles, allUsers);
router.route('/admin/user/:id')
        .get(isAuthenticated, authorizeRoles, getUserDetails)
        .put(isAuthenticated, authorizeRoles, updateUser)
        .delete(isAuthenticated, authorizeRoles, deleteUser);


module.exports = router;