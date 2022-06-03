const express = require('express');
const { createPost, 
        likeUnlikePost, 
        deletePost, 
        getFollowingPost, 
        updatePostCaption, 
        addComments,
        deleteComment,
        getSinglePost
} = require('../controllers/postController');
const router = express.Router();
const {isAuthenticated} = require('../middlewares/auth');

router.route('/post/upload').post(isAuthenticated, createPost);
router.route('/post/:id')
        .get(isAuthenticated, likeUnlikePost)
        .put(isAuthenticated, updatePostCaption)
        .delete(isAuthenticated, deletePost);
router.route('/posts').get(isAuthenticated, getFollowingPost);
router.route('/post/comment/:id')
        .put(isAuthenticated, addComments)
        .delete(isAuthenticated, deleteComment);
router.route("/singlepost/:id").get(isAuthenticated, getSinglePost);

module.exports = router;