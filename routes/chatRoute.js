const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameChat, addToChat, removeFromChat } = require("../controllers/chatController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/chat")
    .post(isAuthenticated, accessChat)
    .get(isAuthenticated, fetchChats);
router.route("/groupchat/create").post(isAuthenticated, createGroupChat);
router.route("/groupchat/rename").put(isAuthenticated, renameChat);
router.route("/groupchat/add").put(isAuthenticated, addToChat);
router.route("/groupchat/remove").put(isAuthenticated, removeFromChat);

module.exports = router;