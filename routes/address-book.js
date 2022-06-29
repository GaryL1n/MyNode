const express = require('express');
const db = require(__dirname + '/../modules/mysql-connect');
const {
    toDateString,
    toDatetimeString,
} = require(__dirname + '/../modules/date-tools');
const moment = require('moment-timezone');
const upload = require(__dirname + '/../modules/upload-images')

const router = express.Router(); // 建立 router 物件

const getListHandler = async (req, res)=>{
    let output = {
        perPage: 10, //一頁看幾筆
        page: 1, //第幾頁
        totalRows: 0, //總筆數
        totalPages: 0, //總頁數
        code: 0,  // 辨識狀態
        error: '',
        query: {},
        rows: [] //資料
    };
    //req.query過來的一律看成字串 所以前面+來改成數字
    let page = +req.query.page || 1;

    let search = req.query.search || '';
    let beginDate = req.query.beginDate || '';
    let endDate = req.query.endDate || '';
    let where = ' WHERE 1 ';
    if(search){
        // 查詢時跳脫字元防止SQL語法錯誤
        where += ` AND mem_name LIKE ${ db.escape('%'+search+'%') } `;
        output.query.search = search;
    }
    if(beginDate){
        const mo = moment(beginDate);
        // isValid()判斷有沒有符合格式
        if(mo.isValid()){
            where += ` AND mem_birthday >= '${mo.format('YYYY-MM-DD')}' `;
            output.query.beginDate = mo.format('YYYY-MM-DD');
        }
    }
    if(endDate){
        const mo = moment(endDate);
        if(mo.isValid()){
            where += ` AND mem_birthday <= '${mo.format('YYYY-MM-DD')}' `;
            output.query.endDate = mo.format('YYYY-MM-DD');
        }
    }
    output.showTest = where;

    //用return來結束這個Fun 因為不能發兩次res
    if(page<1) {
        output.code = 410;
        output.error = '頁碼太小';
        return output;
    }


    //totalRows就是個稱呼而已
    const sql01 = `SELECT COUNT(1) totalRows FROM member ${where}`;
    // JSON格式一直展開
    const [[{totalRows}]] = await db.query(sql01);
    // res.json(totalRows);

    //不要用const
    let totalPages = 0;
    if(totalRows) {
        totalPages = Math.ceil(totalRows/output.perPage);

        if(page>totalPages){
            output.totalPages = totalPages;
            output.code = 420;
            output.error = '頁碼太大';
            return output;
        }

        //拿到該頁資料 ${(page-1)*output.perPage} -->第幾筆開始算
        const sql02 = `SELECT * FROM member ${where} ORDER BY sid DESC LIMIT ${(page-1)*output.perPage}, ${output.perPage}`;
        const [r2] = await db.query(sql02);

        r2.forEach(el=>{
            if(el.mem_birthday){
                //轉換時間格式
                el.mem_birthday = toDateString(el.mem_birthday)
            }else{
                el.mem_birthday='';
            }
            });

        output.rows = r2;

    }
    //展開 覆蓋
    output.code = 200;
    output = {...output, page, totalRows, totalPages};

    return output;
};

router.get('/add', async (req, res)=>{
    res.render('address-book/add');
});

router.post('/add', upload.none(), async (req, res)=>{
    res.json(req.body);
});

//有連線資料庫的話都要async await
router.get('/', async (req, res)=>{
    const output = await getListHandler(req, res);
    switch(output.code){
        case 410:
            return res.redirect(`?page=1`);
            break;
        case 420:
            return res.redirect(`?page=${output.totalPages}`);
            break;
    }
    res.render('address-book/main', output);
});
router.get('/api', async (req, res)=>{
    const output = await getListHandler(req, res);
    res.json(output);
});

module.exports = router;