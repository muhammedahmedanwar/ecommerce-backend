const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);
router.post("/:cartId", authService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authService.allowedTo("admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get("/:id", getSpecificOrder);
router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
