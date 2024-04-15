module.exports = {
  apps: [
    {
      name: "Todo-App",
      script: "./index.js",
      instances: "6",
      exec_mode: "cluster",
      watch: true,
      max_memory_restart: "1G",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
