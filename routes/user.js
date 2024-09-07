const express = require("express");
const router = require("express-promise-router")();

const UserControllers = require("../controllers/user");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");

const passport = require("passport");
const passportConfig = require("../middlewares/passport");

router
  .route("/")
  .get(UserControllers.index)
  .post(validateBody(schemas.userSchema), UserControllers.newUser);

router
  .route("/auth/google")
  .post(
    passport.authenticate("google-plus-token", { session: false }),
    UserControllers.authGoogle
  );

router
  .route("/secret")
  .get(
    passport.authenticate("jwt", { session: false }),
    UserControllers.secret
  );

router
  .route("/signin")
  .post(
    validateBody(schemas.authSignInSchema),
    passport.authenticate("local", { session: false }),
    UserControllers.signIn
  );

router
  .route("/signup")
  .post(validateBody(schemas.authSignUpSchema), UserControllers.signUp);

router
  .route("/:userID")
  .get(validateParam(schemas.idSchema, "userID"), UserControllers.getUser)
  .put(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userSchema),
    UserControllers.replaceUser
  )
  .patch(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    UserControllers.updateUser
  )
  .delete(
    validateParam(schemas.idSchema, "userID"),
    UserControllers.deleteUser
  );

router
  .route("/:userID/cart")
  .get(validateParam(schemas.idSchema, "userID"), UserControllers.getUserCart)
  .delete(
    validateParam(schemas.idSchema, "userID"),
    UserControllers.deleteUserCart
  );

router
  .route("/:userID/cart/:productID")
  .post(
    validateParam(schemas.idSchema, "userID"),
    validateParam(schemas.idSchema, "productID"),
    passport.authenticate("jwt", { session: false }),
    UserControllers.addToCart
  )
  .patch(
    validateParam(schemas.idSchema, "userID"),
    validateParam(schemas.idSchema, "productID"),
    UserControllers.updateCartProduct
  )
  .delete(
    validateParam(schemas.idSchema, "userID"),
    validateParam(schemas.idSchema, "productID"),
    UserControllers.deleteCartProduct
  );

module.exports = router;
