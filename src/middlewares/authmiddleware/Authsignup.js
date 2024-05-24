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
import { checkIfUserExists } from "../../utilities/HandleDbOperations.js";

const AuthenticateInput = async (req, res, next) => {
  try {
    let cookievalue = req.cookies.userjwttoken;
    if (cookievalue) {
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
      userdata.name.length >= USERNAME_MIN_LEN &&
      userdata.name.length <= USERNAME_LEN &&
      userdata.email.length >= USEREMAIL_MIN_LEN &&
      userdata.email.length <= USEREMAIL_LEN &&
      userdata.password.length >= PASSWORD_MIN_LEN &&
      userdata.password.length <= PASSWORD_LEN &&
      PASSWORD_REX.test(userdata.password)
    ) {
      const userExists = await checkIfUserExists(userdata.email);

      userExists.exist
        ? res.status(409).send("User Already Exists with Given Email Id")
        : next();
    } else {
      console.log("errorlll");

      res.status(400).json({
        error: "Constraints not satisfied",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" + error });
  }
};
export { AuthenticateInput };
