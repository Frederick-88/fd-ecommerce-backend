var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/UsersRouter");
var productRouter = require("./routes/ProductRouter");
var orderRouter = require("./routes/OrderRouter");

var app = express();

// biasanya mongoDB diperlukan supaya kita bisa post, ngga hanya get. Istilahnya sebagai database, untuk skala local kita ckup install mongodb dan letakkan nama di url
// tips on setup local connection of mongo database with tools to access DB without using CLI method = https://zellwk.com/blog/local-mongodb/#:~:text=To%20connect%20to%20your%20local,databases%20in%20your%20local%20MongoDB.
const privateURLMongoDB = process.env.PRIVATE_URL_MONGODB_LOCALHOST;
const onlineURLMongoDB = process.env.ONLINE_URL_MONGODB;
// ini adalah sebuah must, dibutuhkan ini untuk mendetect databasemu & mongoDb adalah platform untuk database tanpa itu kau gabisa post
// mongoDB adalah database, pilih yang mana yang ingin kamu gunakan. Development pakai localhost, tapi klau mau hosting udah harus online punya.
mongoose.connect(onlineURLMongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.set("useCreateIndex", true);

app.use(cors());

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// This is to make public users could access our pictures in the folder of productImages that we have added.
// Harus mulai dari tahap pertama "/public" ---> dibuat static dan public sehingga bisa diakses di web.
// dengan url "http://localhost:8000/public/productImages/2020-06-20T10:44:44.152Z-defaultPicture.jpg"
app.use("/public", express.static("public"));
app.use("/public/productImages", express.static("public"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

module.exports = app;
