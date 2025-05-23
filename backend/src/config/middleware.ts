import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

export const configureMiddleware = (app: Express): void => {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
 
  app.use(cookieParser());
  app.use(
    morgan("dev", {
      skip: (req) => req.url === "/api/v1/stripe/webhook",
    })
  );

};
