const http = require("http");
// const fs = require("fs").promises;
const fs = require("fs/promises");

const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf8",
    });

    try {
        await fs.writeFile(
            __dirname + "/../data/header01.txt",
            JSON.stringify(req.headers)
        );
        res.end("完成寫檔3a");
    } catch (ex) {
        console.log(ex);
        res.end("發生錯誤3a");
    }
});

server.listen(3000);
