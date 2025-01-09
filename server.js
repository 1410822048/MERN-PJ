const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const publicRoute = require("./routes").public;
const passport = require("passport");
const cors = require("cors");
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
require("./config/passport")(passport);

mongoose
  //基本mongoose 連接 mongoDB的寫法
  .connect(MONGO_URI, {
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("Connecting to MernDB");
  })
  .catch((e) => {
    console.log(e);
  });

// mongoose
//   //基本mongoose 連接 mongoDB的寫法
//   .connect("mongodb://127.0.0.1:27017/MernDB")
//   .then(() => {
//     console.log("Connecting to MernDB");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.use(express.json()); //express 必須
app.use(express.urlencoded({ extended: true })); //express post 解碼必須
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRoute);
app.use("/api/public", publicRoute);

// 需經過jwt保護，如未有token 則req 就會被視為沒有被授權
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }), //JWT 作為無狀態的認證方式，而不是依赖 session 來保存信息
  courseRoute //如通過認證 才會進到這個Routes裡面
);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("正在運行在8080");
});

// app.listen(8080, () => {
//   console.log("正在運行在8080");
// });
