const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const connectDB = require("./config/database");
const qdrantService = require("./services/qds");

const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");
const documentRoutes = require("./routes/documentRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();

// ---------------- Middleware ----------------

app.use(cors());
app.use(express.json());

// ---------------- Routes ----------------

app.use("/api", uploadRoutes);
app.use("/api", chatRoutes);
app.use("/api", documentRoutes);
app.use("/api", conversationRoutes);

// ---------------- Swagger ----------------

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI PDF Assistant API",
            version: "1.0.0",
            description: "Production RAG Backend"
        }
    },
    apis: ["./routes/*.js"]
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// ---------------- Start Server ----------------

const startServer = async () => {
    try {

        // MongoDB
        await connectDB();

        // Qdrant Payload Index
        await qdrantService.createPayloadIndexes();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {

        console.error("Server Startup Failed");
        console.error(err);

        process.exit(1);
    }
};

startServer();