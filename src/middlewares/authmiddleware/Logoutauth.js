import { logger } from "../../utilities/LoggerFile.js";
const Logoutuser = async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.session === req.session.csrf) {
      next();
    } else {
      logger.error("Error occurred");
      res.status(403).send("Request is Forbidden");
    }
  } catch (err) {
    logger.error("Error occurred", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { Logoutuser };
