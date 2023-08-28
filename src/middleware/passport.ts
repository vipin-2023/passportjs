import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import User from "../models/User";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    process.env.ACCESS_KEY || "JSjXiPMVZXb0fWUVEu37PNgnDTe4to8tkvBrd0skpuQtEF12whjMjcUuTha88Qi1jax9adi61uf4K2yP",
};
const localOptions = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  new LocalStrategy(localOptions, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect email or password " });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
       
      const user = await User.findById(jwtPayload.id);
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
