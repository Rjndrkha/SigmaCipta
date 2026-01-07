const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/middleware");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  SyncDataMovieController,
  GetMoviesController,
  UpdateMovieController,
  DeleteMovieController,
  CreateMovieController,
  GetMovieByIdController,
} = require("../controllers/SyncDataMovieController");
const {
  GetMoviesDashboardController,
} = require("../controllers/dashboardController");

router.get(
  "/sync-data",
  authenticateToken,
  asyncHandler(SyncDataMovieController)
);
router.get("/data", authenticateToken, asyncHandler(GetMoviesController));
router.get(
  "/data/:id",
  authenticateToken,
  asyncHandler(GetMovieByIdController)
);
router.post("/create", authenticateToken, asyncHandler(CreateMovieController));
router.post("/update", authenticateToken, asyncHandler(UpdateMovieController));
router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(DeleteMovieController)
);

router.get(
  "/data-dashboard",
  authenticateToken,
  asyncHandler(GetMoviesDashboardController)
);

module.exports = router;
