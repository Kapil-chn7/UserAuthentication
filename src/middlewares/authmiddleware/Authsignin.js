import {
  USEREMAIL_LEN,
  USEREMAIL_MIN_LEN,
  USERNAME_LEN,
  USERNAME_MIN_LEN,
  PASSWORD_LEN,
  PASSWORD_MIN_LEN,
  PASSWORD_REX,
  COOKIE_EXPIRATION,
} from "../../constants/AuthValidation.js";
import {
  GenerateToken,
  VerifyToken,
} from "../../utilities/GeneratejwtToken.js";
import { verifySignin } from "../../utilities/HandleDbOperations.js";

const Authenticatesignin = async (req, res, next) => {
  try {
    console.log(
      "Insdie Auth Signing.js",
      req.cookies.userjwttoken,
      req.body.data
    );
    let cookievalue = req.cookies.userjwttoken;
    if (cookievalue) {
      console.log("here cooo", cookievalue);
      const data = await VerifyToken(cookievalue);

      console.log("data is ", data);
      if (data.Authorization) {
        return res
          .status(200)
          .send({ data: { name: data.data.name, email: data.data.email } });
      }
    }
    const userdata = req.body.data;

    if (
      (userdata.name &&
        userdata.name.length >= USERNAME_MIN_LEN &&
        userdata.name.length <= USERNAME_LEN) ||
      (userdata.email &&
        userdata.email.length >= USEREMAIL_MIN_LEN &&
        userdata.email.length <= USEREMAIL_LEN &&
        userdata.password.length >= PASSWORD_MIN_LEN &&
        userdata.password.length <= PASSWORD_LEN)
    ) {
      next();
    } else {
      res.status(400).json({
        error: "Provided Information is Wrong",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" + error });
  }
};
export { Authenticatesignin };
