const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");
const {
  newOrder,
  getSingleOrder,
  getMyOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderControler");
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrder);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getAllOrders);
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteOrder);

module.exports = router;
