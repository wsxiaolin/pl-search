const { User } = require("physics-lab-web-api");
const sqlite3 = require("sqlite3").verbose();
const update = ["精选", "知识库", "小说"];

const pl = new User();
const db = new sqlite3.Database("discussion.db");

function insertData(id, name, tag) {
  db.get(`SELECT id FROM data WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error("查询数据出错:", err.message);
    } else if (row) {
      console.error(`ID ${id} 已存在`);
    } else {
      db.run(
        `INSERT INTO data (id, name, type) VALUES (?, ?, ?)`,
        [id, name, tag],
        function (err) {
          if (err) {
            console.error("插入数据出错:", err.message);
          } else {
            console.log(`插入数据成功：ID ${id}, Name ${name}, Type ${tag}`);
          }
        }
      );
    }
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
  await pl.auth.login();

  for (const tag of update) {
    get(tag).then(() => {
      console.log(tag);
    });
  }
}

main().then(() => {
  process.exit(0);
});
