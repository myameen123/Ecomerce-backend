const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  productDetails,
  createProductReview,
  getAllReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, isAuthorizedRole("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateProducts);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteProduct);
router.route("/products/:id").get(productDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getAllReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
