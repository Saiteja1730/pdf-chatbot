const express = require("express");

const chatController =
require("../controllers/chatController");

const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Ask a question
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               documentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */

router.post(

    "/chat",

    chatController.chat

);

module.exports = router;