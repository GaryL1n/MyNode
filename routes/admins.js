const express = require('express');

const router = express.Router(); // 建立 router 物件


//可以一個檔案設定多個路由再放到主路由檔案(index.js)


router.get('/r1/:action?/:id?', (req, res)=>{
    res.json({
        url: req.url, //這檔案的路由 /r1
        baseUrl: req.baseUrl, // index.js 設定的路由 /admins 這裡的路由都掛在這之下
        originalUrl: req.originalUrl, //完整路由 /admins/r1
        params: req.params,
        code: 'admins.js',
    });
});

router.get('/r2/:action?/:id?', (req, res)=>{
    res.json({
        url: req.url,
        params: req.params,
        code: 'admins.js',
    });
});

module.exports = router;

