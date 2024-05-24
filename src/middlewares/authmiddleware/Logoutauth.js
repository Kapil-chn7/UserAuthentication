const Logoutuser = async (req, res, next) => {
  try {
    console.log("this is the req.logout ", req.cookies, req.session);
    if (req.cookies && req.cookies.session === req.session.csrf) {
      next();
    } else {
      res.status(403).send("Request is Forbidden");
    }
  } catch (error) {
    console.log("error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { Logoutuser };
