import passport from 'passport';

const authenticateJwtMiddleware = passport.authenticate('jwt', { session: false });

export default authenticateJwtMiddleware;
