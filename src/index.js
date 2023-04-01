const express = require("express");
require("dotenv").config();
const cors = require("cors")
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT;



app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

//  process JSON Request
app.use(express.json({}));
//  process JSON Request

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors())
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