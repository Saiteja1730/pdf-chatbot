const express = require("express");

const router = express.Router();

const documentController =
require("../controllers/documentController");

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all uploaded documents
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
    "/documents",
    documentController.getDocuments
);

/**
 * @swagger
 * /api/documents/{documentId}:
 *   delete:
 *     summary: Delete a document
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete(
    "/documents/:documentId",
    documentController.deleteDocument
);

module.exports = router;