const axios = require("axios");

const { initializePostgreConnection } = require("../services/postgreServices");

const SyncDataMovieController = async (req, res) => {
  try {
    const response = await axios.get("https://api.tvmaze.com/shows");
    const shows = response.data;

    await initializePostgreConnection();

    for (const shows of movie) {
      const queryInsertSyncMovie = `
      INSERT INTO movies (
        url, name, type, language,
        genres, schedule_days,
        status, runtime, average_runtime,
        premiered, ended, rating,
        image_url, summary
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
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

      const resultInsertSyncMovie = await executePostgrePortalQuery(
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

module.exports = { SyncDataMovieController };
