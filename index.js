require("dotenv").config(); //引用env的方法
const express = require("express");

const app = express(); //建立web sever物件

////view engine指定引勤 ejs不用require
app.set("view engine", "ejs");

//use(接收所有HTML的方法) 通常在所有路由前面 只有404例外要放所最後面(陣列最後)
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

//路由 -->陣列組成
app.get("/", (req, res) => {
    // res.send(`<h2>閉嘴來做愛</h2>`);
    //EJS 不能用send
    res.render("main", { name: "Gary Lin" });
});

//use 404例外要放所最後面(陣列最後)
app.use((req, res) => {
    res.send(`<h2>404  Not Found</h2> <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="100%" />`);
});

//偵聽
app.listen(process.env.PORT, () => {
    console.log(`server started: http://localhost:3600/`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});