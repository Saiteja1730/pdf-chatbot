const express = require("express");

const router = express.Router();

const conversationController =
require("../controllers/conversationController");

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get all conversations
 */
router.get(

    "/conversations",

    conversationController.getConversations

);

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   get:
 *     summary: Get conversation messages
 */
router.get(

    "/messages/:conversationId",

    conversationController.getMessages

);

/**
 * @swagger
 * /api/conversations/{conversationId}:
 *   delete:
 *     summary: Delete conversation
 */
router.delete(

    "/conversations/:conversationId",

    conversationController.deleteConversation

);

module.exports = router;