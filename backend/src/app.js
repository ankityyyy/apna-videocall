// import dotenv from "dotenv";
// dotenv.config();
// const PORT = process.env.PORT || 3002;
// const uri = process.env.ATLASDB_URL;

// import express from "express";
// import { createServer } from "node:http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import cors from "cors";
// import { connectToSocket } from "./src/controllers/socketManager.js";
// import userRoutes from "./src/routes/user.js";

// const app = express();
// const server = createServer(app); // Create HTTP server with Express app
// const io = connectToSocket(server);

// app.use(cors());
// app.use(express.json());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));

// app.use("/api/v1/users", userRoutes);

// app.get("/", (req, res) => {
//   res.send("hello");
// });

// app.listen(PORT, () => {
//   console.log(`listen on port no  ${PORT}`);
//   mongoose.connect(uri);
//   console.log("data base is connect");
// });

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3002;
const uri = process.env.ATLASDB_URL;

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./src/controllers/socketManager.js";
import userRoutes from "./src/routes/user.js";

const app = express();
const server = createServer(app); // Create HTTP server with Express app

// Set up CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Update to your client URL
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  })
);

const io = connectToSocket(server);

// Other middleware and route definitions
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
