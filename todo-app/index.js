/* eslint-disable no-undef */

const app = require("./app");
require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log(
    "Started express server at port http://localhost:" + process.env.PORT
  );
});
