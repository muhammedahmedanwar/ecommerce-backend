const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
