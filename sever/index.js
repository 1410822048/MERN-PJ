const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const cors = require("cors");
dotenv.config();
require("./config/passport")(passport);

mongoose
  //基本mongoose 連接 mongoDB的寫法
  .connect("mongodb://127.0.0.1/MernDB")
  .then(() => {
    console.log("Connecting to MernDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json()); //express 必須
app.use(express.urlencoded({ extended: true })); //express post 解碼必須
app.use(cors());

app.use("/api/user", authRoute);

// 需經過jwt保護，如未有token 則req 就會被視為沒有被授權
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }), //JWT 作為無狀態的認證方式，而不是依赖 session 來保存信息
  courseRoute //如通過認證 才會進到這個Routes裡面
);

app.listen(8080, () => {
  console.log("正在運行在8080");
});
