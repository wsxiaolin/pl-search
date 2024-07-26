const { User } = require("physics-lab-web-api");
const sqlite3 = require("sqlite3").verbose();
const update = ["精选", "知识库", "小说"];

const pl = new User();
const db = new sqlite3.Database("discussion.db");

function insertData(id, name) {
  // 检查是否已存在相同 id 的记录
  db.get(`SELECT id FROM data WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error("查询数据出错:", err.message);
    } else if (row) {
      console.error(`ID ${id} 已存在`);
    } else {
      // 插入新数据
      db.run(
        `INSERT INTO data (id, name) VALUES (?, ?)`,
        [id, name],
        function (err) {
          if (err) {
            console.error("插入数据出错:", err.message);
          } else {
            console.log(`插入数据成功：ID ${id}, Name ${name}`);
          }
        }
      );
    }
  });
}

async function main() {
  await pl.auth.login();
  let j = 0;
  await update.forEach(async (tag) => {
    const re = await pl.projects.query("Discussion", {
      tags: [tag],
      take: -30,
      skip: j,
    });
    if (re.Data.$values.length < 1) {
      console.log("已完成");
    } else {
      re.Data.$values.forEach((i) => {
        j++;
        insertData(i.ID, i.Subject);
      });
    }
  });


}

main();
