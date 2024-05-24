import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { checkIfUserExists } from "../utilities/HandleDbOperations.js";
import "dotenv/config";
const GenerateToken = (data) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.sign(
        data,
        process.env.JWT_PRIVATE_KEY,
        { algorithm: "HS256" },
        function (err, token) {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      );
    });
  } catch (e) {
    logger.error("Error occurred", e);
    return { error: "Internal Server Error" };
  }
};

const GenerateHash = async (password) => {
  console.log("here ");
  return await bcrypt.hash(password, 10);
};
const CompareHash = async (yourpwd, comparepwd) => {
  return await bcrypt.compare(yourpwd, comparepwd);
};

const VerifyToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("toke is ", token);
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      console.log("decoded", decoded);
      const email = decoded.email;
      console.log("decode email", email);
      const userExist = await checkIfUserExists(email);

      if (userExist.exist) {
        resolve({ exist: true, data: userExist.data, Authorization: true });
        return;
      } else {
        resolve({ exist: false, data: null, Authorization: false });
        return;
      }
    } catch (err) {
      console.log("error token ", err);
      resolve({ exist: false, data: null, Authorization: false });

      return;
    }
  });
};

const GenerateCSRFToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export {
  GenerateToken,
  GenerateHash,
  CompareHash,
  VerifyToken,
  GenerateCSRFToken,
};
