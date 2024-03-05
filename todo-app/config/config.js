/* eslint-disable no-undef */
require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: process.env.DB_PASSWORD.includes("secrets")
      ? "ashraf"
      : process.env.DB_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DB_HOST.includes("secrets")
      ? "127.0.0.1"
      : process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD.includes("secrets")
      ? "ashraf"
      : process.env.DB_PASSWORD,
    database: "todo_db_test",
    host: process.env.DB_HOST.includes("secrets")
      ? "127.0.0.1"
      : process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
};
