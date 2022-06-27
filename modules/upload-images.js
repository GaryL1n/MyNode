// 自己寫的上傳檔案模組
const multer = require("multer");
// uuidv 上傳檔案的npm套件 使用v4版本
const { v4: uuidv4 } = require("uuid");

// 設定要接收檔案類型
const extMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
};

// 過濾檔案類型 如果跟以上沒對到就是空值 !!轉換為布林值 true/false
//錯誤回傳null 用後面判斷
// mimetype-->檔案類型
function fileFilter(req, file, cb) {
    cb(null, !!extMap[file.mimetype]);
}

// 設定路徑跟檔案名稱
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 路徑
        // dirname這個檔案的所在位置 + ../public/imgs
        cb(null, __dirname + "/../public/imgs");
    },
    filename: function (req, file, cb) {
        //檔名設定
        // 亂數+檔案類型 mimetype-->檔案類型
        const filename = uuidv4() + extMap[file.mimetype];
        cb(null, filename);
    },
});

module.exports = multer({fileFilter, storage});