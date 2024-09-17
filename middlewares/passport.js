const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const { ExtractJwt } = require("passport-jwt");
const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("../configs/index");

const User = require("../models/User");

// Passport JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Passport Google
passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({
          authGoogleID: profile.id,
          authType: "google",
        });
        if (user) return done(null, user);

        const userEmail = await User.findOne({
          email: profile.emails[0].value,
        });
        if (userEmail) {
          userEmail.avatar = profile._json.picture;
          userEmail.authType = "google";
          userEmail.authGoogleID = profile.id;
          userEmail.name = profile.displayName;
          await userEmail.save();
          done(null, userEmail);
        } else {
          const newUser = new User({
            authType: "google",
            authGoogleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile._json.picture,
          });
          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
