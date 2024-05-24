//Package Import
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
//env variable import
import "dotenv/config";
//import utilities
import { logger } from "./src/utilities/LoggerFile.js";
//import routes
import { signupRoute } from "./src/routes/authentication/AuthenticateUser.js";

const app = express();
const PORT = process.env.DEV_PORT;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(helmet());

app.use(limiter);

//setting up routes
app.use("/user", signupRoute);

//connecting with db
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server Started ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Internal Server Error Database is Not Connected !!");
  });
