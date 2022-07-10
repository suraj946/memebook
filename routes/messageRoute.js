const express = require("express");
const { sendMessage, getAllMessages } = require("../controllers/messageController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/message/send").post(isAuthenticated, sendMessage);
router.route("/message/:chatId").get(isAuthenticated, getAllMessages);

module.exports = router;