require('dotenv').config(); //引用env的方法
const express = require('express');
//上傳檔案的middleware
const multer = require('multer');
//上傳檔案後放的位置
// const upload = multer({ dest: 'tmp-uploads' });
// 載入自己寫好的檔案上傳模組
const upload = require(__dirname + '/modules/upload-images');

const app = express(); //建立web sever物件

////view engine指定引勤 ejs不用require
app.set('view engine', 'ejs');

//通用middleware 設定在所有路由前面
//資料進來依照Content-Type做解析
//extended解析方式
app.use(express.urlencoded({ extended: false })); //設定成可以用POST
app.use(express.json());

//測試用 可以在try-qs?後面加東西 然後用req.query.加的東西 來取得
app.get('/try-qs', (req, res) => {
    res.json(req.query);
});

// middleware: 中介軟體 (function)
//express下面本身就有掛bodyParser 不用另外下載
// const bodyParser = express.urlencoded({ extended: false });
// ( , middleware , ) middleware多個就用陣列
//post資料是傳在body 所以要用bodyParser處理 不然會無法讀取到資料
app.post('/try-post', (req, res) => {
    res.json(req.body);
});

// 先設定路由 再設定方法
app.route('/try-post-form')
    .get((req, res) => {
        res.render('try-post-form');
    })
    .post((req, res) => {
        const { email, password } = req.body;
        res.render('try-post-form', { email, password });
    });

//上傳照片用post方法 加入上傳檔案的middleware single是一個欄位只能上傳一張 avatar是HTML欄位name
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    //檔案資料在req的file
    res.json(req.file);
});

// array一個欄位上傳多張
app.post('/try-uploads', upload.array('photos'), (req, res)=>{
    res.json(req.files);
});

// :之後為代名稱 ?為選擇性的 :自己取?  ?的可以不填 選擇性的優先放後面
app.get('/try-params1/:action?/:id?', (req, res)=>{
    res.json({code:1, params: req.params});
});

//路由 -->陣列組成 get-->只接受用get的方式拜訪
app.get('/', (req, res) => {
    // res.send(`<h2>閉嘴來做愛</h2>`);
    //EJS 不能用send
    res.render('main', { name: 'Gary Lin' });
});

//use(接收所有HTTP的方法) 通常在所有路由前面 只有404例外要放所最後面(陣列最後)
//怕蓋到自己設定的所以放後面了
// ------- 靜態文件 -----------
app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

//use 404例外要放所最後面(陣列最後)
app.use((req, res) => {
    res.send(
        `<h2>404  Not Found</h2> <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="100%" />`
    );
});

//偵聽
app.listen(process.env.PORT, () => {
    console.log(`server started: http://localhost:3600/`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});
