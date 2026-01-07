require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const startApp = () => {
  const app = express();
  // Middleware untuk parsing data form application/x-www-form-urlencoded
  // app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  // app.use(errorRouteHandler);
  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    console.log("Server is running on Port", process.env.PORT);
  });

  app.get("/ping", (req, res) => {
    res.json("Up and Running");
  });

  //Dynamic Routes
  app.use("/auth", require("./routes/authRoute"));
  app.use("/movies", require("./routes/movieRoute"));
};
module.exports = startApp;
