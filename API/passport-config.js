import { createRequire } from "module";
const require = createRequire(import.meta.url);

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

export async function initializePassport(passport) {
  const authenticateUser = async (username, password, done) => {
    const foundUser = await client.db("CrossmediaARG").collection("players").findOne({ username: username });
    if (foundUser == null) {
      return done(null, false, { message: "No user with that username" });
    }

    try {
      if (await bcrypt.compare(password, foundUser.password)) {
        return done(null, foundUser);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "username" }), authenticateUser);
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
}
