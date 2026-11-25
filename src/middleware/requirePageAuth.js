const jwt = require("jsonwebtoken");

const requirePageAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.redirect("/login");
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

module.exports = requirePageAuth;