const express = require("express");
// const router = express.Router();
const router = require("express-promise-router")();

const ProductController = require("../controllers/product");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");

router
  .route("/")
  .get(ProductController.index)
  .post(validateBody(schemas.productSchema), ProductController.newProduct);

router
  .route("/:productID")
  .get(
    validateParam(schemas.idSchema, "productID"),
    ProductController.getProduct
  )
  .put(
    validateParam(schemas.idSchema, "productID"),
    validateBody(schemas.productSchema),
    ProductController.replaceProduct
  )
  .patch(
    validateParam(schemas.idSchema, "productID"),
    ProductController.updateProduct
  )
  .delete();

module.exports = router;
