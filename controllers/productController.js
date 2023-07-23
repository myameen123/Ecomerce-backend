const Products = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandling");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//Create products
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Products.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created Successfully",
    product,
  });
});

//update products
exports.updateProducts = catchAsyncErrors(async (req, res, next) => {
  // let product = await Products.findById(req.params.id);
  const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidaters: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//delete products
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  try {
    const product = await Products.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ succes: true, message: "Product Deleted Successfully" });
  } catch (err) {
    // console.log(err.message);
    return next(new ErrorHandler("Product not found", 500));
  }
});

//get product details
exports.productDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    console.log("here are products\n", product);
    res.status(200).json({
      seccess: true,
      product,
    });
  } catch (err) {
    // console.log(err.message);
    return next(new ErrorHandler("Product not found", 500));
  }
});
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Products.countDocuments();
  const apiFeature = new ApiFeatures(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // const products = await Products.find();
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

//Create a new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Products.findById(productId);
  // console.log(product);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if ((rev) => rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    console.log("Here is ", product.reviews);
    product.numberOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    succes: true,
  });
});

//Getting all reviews
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 403));
  }
  res.status(200).json({
    succes: true,
    reviews: product.reviews,
  });
});

//deleting review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 403));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numberOfReviews = (product.numberOfReviews = reviews.length);
  await Products.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numberOfReviews,
  });
  res.status(200).json({
    succes: true,
  });
});
