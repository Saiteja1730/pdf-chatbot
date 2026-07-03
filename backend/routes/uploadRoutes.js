const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a PDF
 *     description: Upload a PDF file and generate embeddings.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 */

router.post(
    "/upload",
    upload.single("pdf"),
    uploadController.uploadPDF
);

module.exports = router;