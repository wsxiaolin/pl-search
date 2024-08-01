const { User } = require("physics-lab-web-api");
const sqlite3 = require("sqlite3").verbose();
const update = ["精选", "知识库", "小说"];

const pl = new User();
const db = new sqlite3.Database("discussion.db");

function insertData(id, name, tag) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM data WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(new Error("查询数据出错: " + err.message));
      } else if (row) {
        console.error(`ID ${id} 已存在`);
        resolve();
      } else {
        db.run(
          `INSERT INTO data (id, name, type) VALUES (?, ?, ?)`,
          [id, name, tag],
          function (err) {
            if (err) {
              reject(new Error("插入数据出错: " + err.message));
            } else {
              console.log(`插入数据成功：ID ${id}, Name ${name}, Type ${tag}`);
              resolve();
            }
          }
        );
      }
    });
  });
}

async function get(tag) {
  const re = await pl.projects.query("Discussion", {
    tags: [tag],
    take: 20,
  });

  for (const i of re.Data.$values) {
    await insertData(i.ID, i.Subject, tag);
  }
}

async function main() {
  try {
    await pl.auth.login();

    for (const tag of update) {
      await get(tag);
      console.log(tag);
    }
  } catch (error) {
    console.error("发生错误:", error.message);
  } finally {
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error("关闭数据库时出错:", err.message);
      } else {
        console.log("数据库已关闭");
      }
      process.exit(0)
    });
  }
}

main().catch(error => console.error("程序异常:", error.message));
setInterval(()=>{process.exit(-1)},30*1000)
