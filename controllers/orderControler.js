const ErrorHandler = require("../utils/ErrorHandling");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Order = require("../models/orderModel");
const Products = require("../models/productModel");
//create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    texPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    texPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  console.log("yes there");
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  console.log("yes here");
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(200).json({
    seccess: true,
    order,
  });
});
//user Logged in orders
exports.getMyOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    seccess: true,
    orders,
  });
});
//getting all orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    seccess: true,
    totalAmount,
    orders,
  });
});

//update order status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order"));
  }
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.orderStatus = status;
  await order.save({ validateBeforeSaveP: false });
  res.status(200).json({
    seccess: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Products.findById(id);
  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//delete order --Admin
exports.deleteOrder = catchAsyncErrors(async (req, res) => {
  try {
    const order = await Order.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ succes: true, message: "Order Deleted Successfully" });
  } catch (err) {
    // console.log(err.message);
    return next(new ErrorHandler("Order not found", 404));
  }
});
