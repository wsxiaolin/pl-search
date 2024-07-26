const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { Bot } = require("physics-lab-web-api");

const dbPath = path.resolve(__dirname, "discussion.db");

const dbPool = new sqlite3.Database(dbPath);

async function p(c) {
  async function s(c, db) {
    return new Promise((resolve, reject) => {
      let keyword = c.Content.substring(c.Content.indexOf(":") + 1).trim();
      if (keyword.length > 8) {
        resolve("");
      }
      let answer = "";
      const query = `
        SELECT * FROM data
        WHERE name LIKE ?
        ORDER BY RANDOM()
        LIMIT 5
      `;
      const searchTerm = `%${keyword}%`;

      db.all(query, [searchTerm], (err, rows) => {
        if (err) {
          console.error("模糊查询出错:", err.message);
          reject("查询出错");
        } else {
          if (rows.length === 0) {
            resolve("没有匹配的作品");
          } else {
            rows.forEach((o) => {
              answer += `\n - <discussion=${o.id}>${o.name}</discussion>【来自：${o.type}】`;
            });
            if (rows.length == 5) {
              answer += "\n ....."
            }
            resolve(answer);
          }
        }
      });
    });
  }

  try {
    const result = await s(c, dbPool);
    return result;
  } catch (error) {
    console.error("查询失败:", error);
    return "";
  }
}

async function main() {
  const bot = new Bot("xiegushi2022@outlook.com", "hh090108", p);
  await bot.auth.login();
  await bot.init("669dcf869e258e6b2f51b5d2", "Discussion", {
    replyRequired: false,
    readHistory: true,
  });
  bot.start(60);
}

main();

