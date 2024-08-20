const router = require("express").Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/oderController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

router.use(isAuthenticated);

router.post("/order/new", newOrder);
router.get("/order/:id", getSingleOrder);
router.get("/orders/me", myOrders);
router.get("/admin/orders", authorizeRoles, allOrders);
router.put("/admin/order/:id", authorizeRoles, updateOrder);
router.delete("/admin/order/:id", authorizeRoles, deleteOrder);

module.exports = router;
