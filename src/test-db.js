const db = require(__dirname + '/../modules/mysql-connect');

(async () => {
    // show databases;
    // use fteam;
    // show tables;
    const [results, fields] = await db.query('SELECT * FROM member LIMIT 3');

    console.log(results);
    //基本上不會用到field
    // console.log(fields);
    process.exit(); // 結束行程 因為promise
})();
