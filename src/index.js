const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

// To process JSON Request
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
// To process JSON Request

const db = require("./db/dbconfig");

app.use("/", require("./routes/router"));

app.use(express.json());
app.listen(port, () => {
  console.log(`Server is up and running in port ${port}`);
  db.mongooseConnect(process.env.MONGOURL)
    .then(() => {
      console.log("DB connection Successfull");
    })
    .catch((err) => {
      console.log(err);
    });
});
