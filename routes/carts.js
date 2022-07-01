const express = require("express");
const db = require(__dirname + "/../modules/mysql-connect");

const moment = require("moment-timezone");
const Joi = require("joi");
const upload = require(__dirname + "/../modules/upload-images");

const router = express.Router(); // 建立 router 物件
const fake_user = 5;

const getUserCart = async (user_id) => {
    const sql = `SELECT p.*, c.quantity
    FROM carts c
    JOIN products p
    ON c.product_id=p.sid
    WHERE user_id=?
    ORDER BY c.created_at`;

    const [r] = await db.query(sql, [user_id]);
    return r;
};

// 用urlincodeing傳
router.post("/", async (req, res) => {
    // body: product_id, quantity
    const output = {
        success: false,
        error: "",
    };
    if (!req.body.product_id || !req.body.quantity) {
        output.error = "參數不足";
        return res.json(output);
    }

    if (+req.body.quantity < 1) {
        output.error = "數量不能小於 1";
        return res.json(output);
    }

    // 判斷該商品是否已經加入購物車
    const sql3 = `SELECT COUNT(1) num FROM carts WHERE product_id=? AND user_id=?`;
    const [[{ num }]] = await db.query(sql3, [req.body.product_id, fake_user]);
    if (num > 0) {
        output.error = "購物車內已經有這項商品";
        return res.json(output);
    }

    const sql = `SELECT * FROM products WHERE sid=?`;
    const [r1] = await db.query(sql, [req.body.product_id]);
    if (!r1.length) {
        output.error = "沒有這個商品";
        return res.json(output);
    }

    const sql2 =
        "INSERT INTO `carts`(`user_id`, `product_id`, `quantity`) VALUES (?, ?, ?)";
    // 假設用戶編號 fake_user
    const [r2] = await db.query(sql2, [
        fake_user,
        req.body.product_id,
        req.body.quantity,
    ]);

    if (r2.affectedRows) {
        output.success = true;
    }

    output.cart = await getUserCart(fake_user);
    res.json(output);
});

router.get("/", async (req, res) => {
    res.json(await getUserCart(fake_user));
});

router.put("/", async (req, res) => {
    // body: product_id, quantity
    const output = {
        success: false,
        error: "",
    };
    if (!req.body.product_id || !req.body.quantity) {
        output.error = "參數不足";
        return res.json(output);
    }

    if (+req.body.quantity < 1) {
        output.error = "數量不能小於 1";
        return res.json(output);
    }

    // 判斷該商品是否已經加入購物車
    const sql3 = `SELECT COUNT(1) num FROM carts WHERE product_id=? AND user_id=?`;
    const [[{ num }]] = await db.query(sql3, [req.body.product_id, fake_user]);
    if (num <= 0) {
        output.error = "購物車內沒有這項商品";
        return res.json(output);
    }


    const sql2 = "UPDATE `carts` SET `quantity`=? WHERE product_id=? AND user_id=?";
    const [r2] = await db.query(sql2, [
        req.body.quantity,
        req.body.product_id,
        fake_user,
    ]);
    output.r2 = r2;

    // affectedRows 有沒有該項目 changedRows 有沒有變更
    if (r2.affectedRows && r2.changedRows) {
        output.success = true;
    }

    output.cart = await getUserCart(fake_user);
    res.json(output);
});
router.delete("/", async (req, res) => {
    // product_id
    const sql = "DELETE FROM carts WHERE user_id=? AND product_id=?";
    await db.query(sql, [fake_user, req.body.product_id]);

    res.json(await getUserCart(fake_user));
});

module.exports = router;
