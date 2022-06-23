// 匯入 多個的時候包成物件匯入
const { f, k } = require('./func02');
// 同支檔案只能require一次

console.log(f(7));
console.log(k(7));