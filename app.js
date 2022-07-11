const express = require("express");
const cors = require("cors");

const computeRoute = require('./route')
const app = express();



app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/split-payments", (req, res, next) => {
  res.json({ message: "Welcome to Lannister Pay tssp" });
});

app.use("/split-payments", computeRoute.router);


app.listen(process.env.PORT || 3001);
