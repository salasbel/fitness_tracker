// build and export your unconnected client here

const { Client } = require("pg");

// this is just a string which points us to the correct db on our computer
const connectionString = 'https://localhost:5432/fitness-dev'

const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = { client };
