const express = require("express");
const router = express.Router();
const {
  authentificationController,
} = require("../controllers/authentificationController/authentificationController")
const { asyncHandler } = require("../middleware/errorHandler");


router.post("/login", asyncHandler(authentificationController));

module.exports = router;
