req.query
網域?後面加東西 然後用req.query.加的東西 來取得
效能比params

req.body
表單資料用body

req.params
變數代稱設定路由
取得變數代稱中的值

req.file
req.files
檔案類型用上面兩個 單一or多個
------------------------------------
後端res.json()是轉成json格式
前端res.json()是把json格式解析成原生類型

res.send()很多方式送出去 不嚴謹 -->丟物件的話會轉成json
res.render()是渲染

res.redirect() 頁面跳轉
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


不要這樣用
/products/:category_id/:product_id

