// const path = require("path");
require("dotenv").config();
const path = require("path");
const { search } = require("./src/routes");

module.exports = {
  development: {
    client: "postgres",
    connection: process.env.DATABASE_URL,
    searchPath: ["xt"],
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds")
    },
    useNullAsDefault: true
  }
};

// host: "::1",
//       port: 5432,
//       user: "postgres",
//       password: "masterkey",
//       database: "postgres"