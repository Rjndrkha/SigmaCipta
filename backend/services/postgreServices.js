require("dotenv").config();
const { Client } = require("pg");

const PostgreClient = new Client({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "appdb",
  port: 5432,
});

let isConnected = false;

async function initializePostgreConnection() {
  if (isConnected) {
    console.log("Skipping PostgreSQL re-connection");
    return;
  }
  try {
    await PostgreClient.connect();
    isConnected = true;
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL connection", error.stack);
    process.exit(1);
  }
}

async function executePostgreQuery(query, params) {
  try {
    const result = await PostgreClient.query(query, params);
    if (result.command === "INSERT" || result.command === "UPDATE") {
      return {
        totalData: result.rowCount,
        message: "Data executed successfully",
      };
    }
    return {
      totalData: result.rows.length,
      rows: result.rows,
      message: "Data fetched successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  initializePostgreConnection,
  executePostgreQuery,
};
