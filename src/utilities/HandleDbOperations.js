import mongoose from "mongoose";
import User from "../models/authmodels/UserModel.js";
import {
  GenerateToken,
  GenerateHash,
  CompareHash,
} from "../utilities/GeneratejwtToken.js";
import "dotenv/config";

export const checkIfUserExists = async (email) => {
  const user = await User.findOne({ email });

  return { exist: !!user, data: user };
};
export const addUser = async (userData) => {
  try {
    // res.cookie("usertoken", JSON.stringify(token), {
    //   expiry: COOKIE_EXPIRATION,
    // });
    const hashedpwd = await GenerateHash(userData.password);

    const userCreated = await User.create({ ...userData, password: hashedpwd });
    const userInfo = {
      name: userCreated.name,
      email: userCreated.email,
      id: userCreated._id,
    };
    const token = await GenerateToken(userInfo);
    if (token.error) {
      return token.error;
    } else {
      return {
        success: "Successfully Entered User",
        token,
        userCreated: {
          name: userCreated.name,
          email: userCreated.email,
          id: userCreated._id,
        },
      };
    }
  } catch (error) {
    return { error };
  }
};
export const verifySignin = async (userdata) => {
  try {
    console.log("Inside HandleDbOperation.js");

    let userFind = null;
    let findQuery = userdata.email
      ? { email: userdata.email }
      : { name: userdata.name };

    userFind = await User.findOne(findQuery);
    console.log(
      "userFind ",
      userFind,
      userFind.email,
      userdata.email,
      userFind.password
    );
    if (userFind.email === userdata.email) {
      const resultComp = await CompareHash(
        userdata.password,
        userFind.password
      );

      if (resultComp) {
        return {
          exist: true,
          userdata: {
            _id: userFind._id,
            name: userFind.name,
            email: userFind.email,
          },
        };
      } else {
        return {
          exist: false,
          userdata: null,
          message: "Password is wrong",
        };
      }
    } else {
      let message = userdata.email ? "Email Not Found" : "Name Not Found";
      return {
        exist: false,
        userdata: null,
        message: message,
      };
    }
  } catch (err) {
    console.error("Error:", err);
    return { error: "Internal Server Error" };
  }
};
