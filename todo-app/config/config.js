/* eslint-disable no-undef */
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "ashraf",
    database: "todo_db_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
};
