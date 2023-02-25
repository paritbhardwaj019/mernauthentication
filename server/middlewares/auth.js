const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ errorMessage: "UnAuthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified.user;

    next();
  } catch (error) {
    res.status(401).json({ errorMessage: "UnAuthorized" });
  }
}
module.exports = auth;
