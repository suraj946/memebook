const express = require('express');
const{ registerUser,
        loginUser, 
        followUnfollowUser, 
        logOutUser, 
        updatePassword, 
        updateProfile, 
        deleteMyAccount,
        myProfile,
        getUserProfile,
        getAllUsers,
        forgotPassword,
        resetPassword,
        myPosts,
        getUserPosts
} = require('../controllers/userController');
const {isAuthenticated} = require('../middlewares/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/follow/:id").get(isAuthenticated, followUnfollowUser);
router.route('/update/password').put(isAuthenticated, updatePassword);
router.route('/update/profile').put(isAuthenticated, updateProfile);
router.route('/delete/me').delete(isAuthenticated, deleteMyAccount);
router.route('/me').get(isAuthenticated, myProfile);
router.route("/my/posts").get(isAuthenticated, myPosts);
router.route("/userposts/:id").get(isAuthenticated, getUserPosts);
router.route('/user/:id').get(isAuthenticated, getUserProfile);
router.route('/users').get(isAuthenticated, getAllUsers);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

module.exports = router;