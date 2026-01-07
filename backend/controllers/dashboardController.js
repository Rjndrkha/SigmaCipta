const axios = require("axios");

const {
  initializePostgreConnection,
  executePostgreQuery,
} = require("../services/postgreServices");

const GetMoviesDashboardController = async (req, res) => {
  try {
    await initializePostgreConnection();

    const startDate =
      req.query.start_date ||
      new Date(new Date().setMonth(new Date().getMonth() - 1))
        .toISOString()
        .slice(0, 10);

    const endDate = req.query.end_date || new Date().toISOString().slice(0, 10);

    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM movies
      WHERE created_at BETWEEN $1 AND $2
    `;
    const totalResult = await executePostgreQuery(totalQuery, [
      startDate,
      endDate,
    ]);

    const categoryQuery = `
      SELECT type, COUNT(*) AS total
      FROM movies
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY type
      ORDER BY total DESC
    `;
    const categoryResult = await executePostgreQuery(categoryQuery, [
      startDate,
      endDate,
    ]);

    const latestQuery = `
      SELECT id, name, type, created_at
      FROM movies
      WHERE created_at BETWEEN $1 AND $2
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const latestResult = await executePostgreQuery(latestQuery, [
      startDate,
      endDate,
    ]);

    const dailyQuery = `
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS total
      FROM movies
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const dailyResult = await executePostgreQuery(dailyQuery, [
      startDate,
      endDate,
    ]);

    res.status(200).json({
      summary: {
        total: Number(totalResult.rows[0].total),
        mostCategory: categoryResult.rows[0] || null,
        latest: latestResult.rows,
      },
      pieChart: categoryResult.rows,
      columnChart: dailyResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { GetMoviesDashboardController };
