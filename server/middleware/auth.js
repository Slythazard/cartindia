const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        // Token was invalid or expired — ignore it
        return next();
      }
      if (user) {
        req.user = user;
      }
      return next();
    })(req, res, next);
  } else {
    next();
  }
};

module.exports = {
  auth, // For protected routes
  optionalAuth // For public routes that can work with or without auth
};
