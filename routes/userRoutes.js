const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userControler");
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");

const router = express.Router();
//registration router
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

//admin
router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getSingleUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAuthorizedRole("admin"), getSingleUser)
  .put(isAuthenticatedUser, isAuthorizedRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteUser);

module.exports = router;
