require("dotenv").config();

const { DB_USER, DB_PASS, NODE_ENV } = process.env;

console.log({ DB_USER, DB_PASS, NODE_ENV });
