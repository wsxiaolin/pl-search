const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "discussion.db");
const db = new sqlite3.Database(dbPath);

// 关闭数据库连接
db.close();

// 创建新的数据库连接并重新定义表结构
const dbNew = new sqlite3.Database(dbPath);

// 修改表结构的 SQL 语句
const alterTableQuery = `
CREATE TABLE IF NOT EXISTS data (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT
);
`;

// 执行修改表结构的 SQL 命令
dbNew.run(alterTableQuery, function (err) {
  if (err) {
    return console.error("修改表结构出错:", err.message);
  }
  console.log("表结构修改成功");
});

// 关闭新的数据库连接
dbNew.close();
