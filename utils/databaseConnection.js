const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDatabse = () => {
  console.log(process.env.DATABASE_URI);
  mongoose.connect(process.env.DATABASE_URI).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  });
};
module.exports = connectDatabse;
