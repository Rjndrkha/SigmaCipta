const { default: axios } = require("axios");
const {
  initializePostgreConnection,
  executePostgreQuery,
} = require("../services/postgreServices");

const SyncDataMovieController = async (req, res) => {
  try {
    const response = await axios.get("https://api.tvmaze.com/shows");
    const shows = response.data;

    await initializePostgreConnection();

    for (const movie of shows) {
      const queryInsertSyncMovie = `
      INSERT INTO movies (
        url, name, type, language,
        genres, schedule_days,
        status, runtime, average_runtime,
        premiered, ended, rating,
        image_url, summary
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (url) DO NOTHING
    `;
      const paramsInsertSyncMovie = [
        movie.url,
        movie.name,
        movie.type,
        movie.language,
        movie.genres.join(", "),
        movie.schedule?.days.join(", "),
        movie.status,
        movie.runtime,
        movie.averageRuntime,
        movie.premiered,
        movie.ended,
        movie.rating?.average,
        movie.image?.original,
        movie.summary,
      ];

      const resultInsertSyncMovie = await executePostgreQuery(
        queryInsertSyncMovie,
        paramsInsertSyncMovie
      );
    }

    return res.status(200).json({
      message: "Data berhasil Disimpan",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const GetMoviesController = async (req, res) => {
  try {
    await initializePostgreConnection();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT * FROM movies
      ORDER BY premiered DESC
      LIMIT $1 OFFSET $2
    `;
    const dataResult = await executePostgreQuery(dataQuery, [limit, offset]);

    const countQuery = `SELECT COUNT(*) FROM movies`;
    const countResult = await executePostgreQuery(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      data: dataResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetMovieByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    await initializePostgreConnection();

    const query = `SELECT * FROM movies WHERE id = $1`;
    const result = await executePostgreQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie tidak ditemukan" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const DeleteMovieController = async (req, res) => {
  try {
    const { id } = req.params;

    await initializePostgreConnection();

    const query = `DELETE FROM movies WHERE id = $1 RETURNING *`;
    const result = await executePostgreQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie tidak ditemukan" });
    }

    res.status(200).json({
      message: "Movie berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const CreateMovieController = async (req, res) => {
  try {
    const {
      url,
      name,
      type,
      language,
      genres,
      schedule_days,
      status,
      runtime,
      average_runtime,
      premiered,
      ended,
      rating,
      image_url,
      summary,
    } = req.body;

    if (
      !name ||
      !url ||
      !type ||
      !language ||
      !genres ||
      !schedule_days ||
      !status ||
      !runtime ||
      !average_runtime ||
      !premiered ||
      !rating ||
      !image_url ||
      !summary
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const genresString = Array.isArray(genres) ? genres.join(",") : genres;

    const scheduleDaysString = Array.isArray(schedule_days)
      ? schedule_days.join(",")
      : schedule_days;

    await initializePostgreConnection();

    const query = `
      INSERT INTO movies (
        url, name, type, language,
        genres, schedule_days,
        status, runtime, average_runtime,
        premiered, ended, rating,
        image_url, summary
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `;

    const result = await executePostgreQuery(query, [
      url,
      name,
      type,
      language,
      genresString,
      scheduleDaysString,
      status,
      runtime,
      average_runtime,
      premiered,
      ended || null,
      rating,
      image_url,
      summary,
    ]);

    res.status(200).json({
      message: "Movie berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const UpdateMovieController = async (req, res) => {
  try {
    const {
      id,
      url,
      name,
      type,
      language,
      genres,
      schedule_days,
      status,
      runtime,
      average_runtime,
      premiered,
      ended,
      rating,
      image_url,
      summary,
    } = req.body;

    if (
      !id ||
      !url ||
      !name ||
      !type ||
      !language ||
      !genres ||
      !schedule_days ||
      !status ||
      runtime === undefined ||
      average_runtime === undefined ||
      !premiered ||
      rating === undefined ||
      !image_url ||
      !summary
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await initializePostgreConnection();

    const query = `
      UPDATE movies SET
        name = $1,
        type = $2,
        language = $3,
        genres = $4,
        schedule_days = $5,
        status = $6,
        runtime = $7,
        average_runtime = $8,
        premiered = $9,
        ended = $10,
        rating = $11,
        image_url = $12,
        summary = $13,
        url = $15
      WHERE id = $14
      RETURNING *
    `;

    const result = await executePostgreQuery(query, [
      name,
      type,
      language,
      genres,
      schedule_days,
      status,
      runtime,
      average_runtime,
      premiered,
      ended,
      rating,
      image_url,
      summary,
      id,
      url,
    ]);

    res.status(200).json({
      message: "Movie berhasil Di Update",
    });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  SyncDataMovieController,
  CreateMovieController,
  UpdateMovieController,
  DeleteMovieController,
  GetMoviesController,
  GetMovieByIdController,
};
