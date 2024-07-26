const sqlite3 = require("sqlite3").verbose();

// 创建一个新的数据库连接
let db = new sqlite3.Database("./discussion.db", (err) => {
  if (err) {
    console.error(err.message);
  }
});

function queryData(tag, name) {
  const sqlQuery = "SELECT * FROM data WHERE type = ? AND name LIKE ? LIMIT 10";

  db.all(sqlQuery, [tag, `%${name}%`], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}

// 使用示例
queryData("小说", "柴");

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
});
