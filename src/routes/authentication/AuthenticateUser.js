import express from "express";
import crypt from "crypto";
const signupRoute = express.Router();
import { AuthenticateInput } from "../../middlewares/authmiddleware/Authsignup.js";
import { Authenticatesignin } from "../../middlewares/authmiddleware/Authsignin.js";
import { verifySignin } from "../../utilities/HandleDbOperations.js";
import { Logoutuser } from "../../middlewares/authmiddleware/Logoutauth.js";
import { addUser } from "../../utilities/HandleDbOperations.js";
import {
  GenerateToken,
  GenerateCSRFToken,
} from "../../utilities/GeneratejwtToken.js";
import { COOKIE_EXPIRATION } from "../../constants/AuthValidation.js";

signupRoute.post("/signup", AuthenticateInput, async (req, res) => {
  //add user to database if he doesn't exist
  try {
    const response = await addUser(req.body.data, req, res);
    if (response.success) {
      const csrftoken = GenerateCSRFToken();
      console.log("thsi is the csrf ", csrftoken, req.session);
      req.session.csrf = csrftoken;
      res.cookie("userjwttoken", response.token, {
        expiry: COOKIE_EXPIRATION,
        sameSite: "strict",
        secure: true,
      });
      res.cookie("session", csrftoken, { sameSite: "strict", secure: true });
      res.status(201).send({
        message: "User Created",
        data: { ...response.userCreated },
      });
    } else {
      res.status(500).send({
        message: "Internal Server Error",
        data: null,
      });
    }
  } catch (err) {
    console.log("Error ", err);
    res.status(500).send({
      message: "An Error occured during signup",
      data: null,
    });
  }
});

//routes to signin user
signupRoute.post("/signin", Authenticatesignin, async (req, res) => {
  try {
    const userdata = req.body.data;
    const userExists = await verifySignin(userdata);
    console.log("here sssss", userExists);
    if (userExists.exist) {
      const userInfo = {
        name: userExists.userdata.name,
        email: userExists.userdata.email,
        id: userExists.userdata._id,
      };

      const token = await GenerateToken(userInfo);
      const csrftoken = GenerateCSRFToken();

      //incase if there are more functionalities that need session token then use this
      req.session.csrf = csrftoken;
      console.log(
        "nnnnnnnnnnnnnnnnnthis is the req.session ",
        req.session.csrf
      );

      res.cookie("userjwttoken", token, {
        expiry: COOKIE_EXPIRATION,
      });
      res.cookie("session", csrftoken, { sameSite: "strict", secure: true });
      res.status(200).send({
        message: "Success User successfully signed in",
        data: userInfo,
        allowed: true,
      });
    } else {
      res
        .status(401)
        .send({ message: "User is Unauthorized", allowed: false, data: null });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server Error", allowed: false, data: null });
  }
});

//routes to logout user
signupRoute.post("/logout", Logoutuser, (req, res) => {
  try {
    res.cookie("userjwttoken", null, {
      expiry: 0,
    });
    res.cookie("session", null, {
      expiry: 0,
    });
    res.status(200).send("Logged Out Successfully");
  } catch (err) {
    res.send(500).send("Internal Server Error");
  }
});

export { signupRoute };
