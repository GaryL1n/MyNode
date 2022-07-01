

req.query

req.body

req.params

req.file
req.files

req.session
------------------------------------
res.end()

res.send()

res.json()

res.render()

res.redirect()
------------------------------------
# RESTful API

# CRUD


# 列表 (GET)
/products
/products?page=2
/products?page=2&search=找東西

# 單一商品 (GET)
/products/:id

# 新增商品 (POST)
/products

# 修改商品 (PUT)
/products/:id

# 刪除商品 (DELETE)
/products/:id



/products/:category_id/:product_id

------------------------------------
cart table 購物車的資料表參考
----------------
PK

item_type: product, event, ticket

user_id

item_id :12

quantity

created_at
----------------
CREATE TABLE `carts` (
  `sid` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `carts`
  ADD PRIMARY KEY (`sid`);

ALTER TABLE `carts`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;
------------------------------------
同源政策 (Same-origin policy)
protocol, domain, port
------------------------------------








