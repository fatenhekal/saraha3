import express from "express";
import cors from "cors";
import configService from "./config/config.service.js";
import { dbConnect } from "./database/connection.js";
import { errorHandler } from "./common/index.js";
import { authController, userController } from "./module/index.js";

const app = express();
const port = configService.port;

await dbConnect();

app.use(cors(), express.json());

app.use("/auth", authController);
app.use("/user", userController);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "I m running"
    });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
