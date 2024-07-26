const { User } = require("physics-lab-web-api");
const sqlite3 = require("sqlite3").verbose();

const pl = new User();
const db = new sqlite3.Database("discussion.db");
let lastQueryIndex = "669dbd7e9e258e6b2f51b22a";

function insertData(id, name) {
  // Check if a record with the same id already exists
  db.get(`SELECT id FROM data WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error("查询数据出错:", err.message);
    } else if (row) {
      console.error(`ID ${id} 已存在`);
    } else {
      // Insert new data
      db.run(
        `INSERT INTO data (id, name, type) VALUES (?, ?, ?)`,
        [id, name, '精选'],
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

  try {
    while (true) {
      const re = await pl.projects.query("Discussion", {
        tags: ["精选"],
        take: -100,
        From: lastQueryIndex,
        skip: j,
      });

      if (re.Data.$values.length < 1) {
        console.log("已完成");
        break;
      } else {
        re.Data.$values.forEach((i) => {
          j++;
          if (!i.Tags.includes("精选")) {
            console.log(i.Tags);
            throw new Error("项目标签不包含'精选'");
          }
          insertData(i.ID, i.Subject);
          console.log(lastQueryIndex);
          lastQueryIndex = i.ID;
        });
      }
    }
  } catch (err) {
    console.error("发生错误:", err.message);
  }
}

main();