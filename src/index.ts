/* eslint-disable no-unsafe-optional-chaining */
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "typescript-rest";
import bodyParser from "body-parser";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

import "./controllers";
const port = Number(process.env.PORT) || 3080;

import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(bodyParser.json());

    Server.buildServices(app);

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server Started at PORT: ${port}`);
    });
  })
  .catch((err) => console.log("connection :", err));
