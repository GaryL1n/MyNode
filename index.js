require('dotenv').config(); //引用env的方法
const express = require('express');
//上傳檔案的middleware
const multer = require('multer');
//上傳檔案後放的位置
// const upload = multer({ dest: 'tmp-uploads' });
// 載入自己寫好的檔案上傳模組
const upload = require(__dirname + '/modules/upload-images');
const session = require('express-session');
const moment = require('moment-timezone');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const { toDateString, toDatetimeString } = require(__dirname +
    '/modules/date-tools');

//session存到資料表
const db = require(__dirname + '/modules/mysql-connect');
const MysqlStore = require('express-mysql-session')(session);
const sessionStore = new MysqlStore({}, db);
const cors = require('cors')

const app = express(); //建立web sever物件

////view engine指定引勤 ejs不用require
app.set('view engine', 'ejs');
// 網域url區分大小寫 預設false是都轉成小寫
app.set('case sensitive routing', true);

// 一律允許跨來源網域 雖然能查看內容 但cookie要domain一樣才能存取
const corsOptions = {
    credentials: true,
    origin: (origin, cb)=>{
        console.log({origin});
        // 錯誤丟空值 一律允許 正常是要設定白名單的-->看講義
        cb(null, true);
    }
};

app.use(cors(corsOptions));
//放在所有use最前面
app.use(
    session({
        //新用戶沒有使用到session物件時不會建立session和發送cookie 否
        saveUninitialized: false,
        //沒變更內容是否強制回存 否
        resave: false,
        //加密用的字串 隨便打
        secret: 'sdgghdtjmjtudrujyjdtgfhjtjudktujk',
        //存進資料表
        store: sessionStore,
        //設定cookie過期時間
        cookie: {
            maxAge: 1800000, // 30 min
        },
    })
);
//通用middleware 設定在所有路由前面
//資料進來依照Content-Type做解析
//extended解析方式
app.use(express.urlencoded({ extended: false })); //設定成可以用POST
app.use(express.json());
app.use((req, res, next) => {
    res.locals.member = 'Gary Lin';

    res.locals.toDateString = toDateString;
    res.locals.toDatetimeString = toDatetimeString;
    res.locals.session = req.session;

    next();
});

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
app.post('/try-uploads', upload.array('photos'), (req, res) => {
    res.json(req.files);
});

// :之後為代名稱 ?為選擇性的 :自己取?  ?的可以不填 選擇性的優先放後面
app.get('/try-params1/:action?/:id?', (req, res) => {
    res.json({ code: 1, params: req.params });
});

//以下兩種方式較少用
app.get(/^\/hi\/?/i, (req, res) => {
    res.send({ url: req.url });
});
app.get(['/aaa', '/bbb'], (req, res) => {
    res.send({ url: req.url, code: 'array' });
});

app.get('/try-json', (req, res) => {
    // json格式require進來會自動jsonparse
    // 以這範例來說變成陣列
    const data = require(__dirname + '/data/data01');
    console.log(data);
    res.locals.rows = data;
    res.render('try-json');
});

app.get('/try-moment', (req, res) => {
    // 設定格式
    const fm = 'YYYY-MM-DD HH:mm:ss';
    //現在時間
    const m1 = moment();
    //設定時間
    const m2 = moment('2022-02-28');

    res.json({
        // 輸出
        m1: m1.format(fm),
        //設定時區再輸出
        m1a: m1.tz('Europe/London').format(fm),
        m2: m2.format(fm),
        m2a: m2.tz('Europe/London').format(fm),
    });
});

// 從其他地方引入路由 該引入的檔案的路由都掛在前綴路由/admins之下
// app.use('/admins', require(__dirname + '/routes/admins'));
// 也可以用以下寫法(比較少)
//同個路由檔案掛在/admins還有根目錄底下
const adminsRouter = require(__dirname + '/routes/admins');
// prefix 前綴路徑
app.use('/admins', adminsRouter);
app.use(adminsRouter);

app.get('/try-session', (req, res) => {
    req.session.my_test = req.session.my_test || 0;
    req.session.my_test++;
    res.json({
        my_test: req.session.my_test,
        session: req.session,
    });
});

app.use('/address-book', require(__dirname + '/routes/address-book'));
app.use('/carts', require(__dirname + '/routes/carts'));

app.get('/yahoo', async (req, res) => {
    axios.get('https://tw.yahoo.com/').then(function (response) {
        // handle success
        console.log(response);
        res.send(response.data);
    });
});

app.route('/login')
    .get(async (req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        const sql = 'SELECT * FROM admins WHERE account=?';
        const [r1] = await db.query(sql, [req.body.account]);

        if (!r1.length) {
            // 帳號錯誤
            output.code = 401;
            output.error = '帳密錯誤';
            return res.json(output);
        }
        //const row = r1[0];

        output.success = await bcrypt.compare(
            req.body.password,
            r1[0].pass_hash
        );
        console.log(await bcrypt.compare(req.body.password, r1[0].pass_hash));
        if (!output.success) {
            // 密碼錯誤
            output.code = 402;
            output.error = '帳密錯誤';
        } else {
            req.session.admin = {
                sid: r1[0].sid,
                account: r1[0].account,
            };
        }

        res.json(output);
    });

app.get('/logout', (req, res) => {
    delete req.session.admin;
    res.redirect('/');
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
app.use('/joi', express.static('node_modules/joi/dist'));

// ----------------------------
//use 404例外要放所最後面(陣列最後)
app.use((req, res) => {
    res.send(
        `<h2>404  Not Found</h2> <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="100%" />`
    );
});

//偵聽
app.listen(process.env.PORT, () => {
    console.log(`server started: http://localhost:3600`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});
