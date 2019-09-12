const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../startup/config');

module.exports = function verifyAuth({ blockOnAuth, requireToken }) {
  return (req, res, next) => {
    try {
      req.token = jwt.verify(req.cookies.sid, jwtSecret);
      req.isAuthenticated = true;
      
      if (blockOnAuth) return res.send('Already signed in');
    } catch (error) {
      req.isAuthenticated = false;
      
      if (requireToken) return res.status(401).send('Please sign in first');
    }
    next();
  }
}