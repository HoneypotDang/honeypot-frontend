import dotenv from "dotenv";
dotenv.config();
import path from "path";
import fs from 'fs-extra';

import postgres from "postgres";
export const pg = postgres(process.env.DB, {
  max: process.env.NODE_ENV === "development" ? 10 : 50,
  idle_timeout: 10,
  connect_timeout: 30,
  ssl: true,
  connection: {
    application_name: "honey_frontend",
  },
  debug: process.env.DEBUG === "true" ?
    function (connection, query, params, types) {
      // console.log(chalk.blue(JSON.stringify(params)))
      const newQuery = query.replace(/\$(\d+)/g, (match, p1) => {
        const replace = params[p1 - 1]
        if (typeof replace === "string") {
          return `'${replace}'`
        }
        return replace
      })
      console.log(newQuery)
    } : false
});


async function syncConfigFromDB() {
  try {
    // 检查config表是否存在
    const tableExists = await pg`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'config'
      );
    `;
    // 如果表不存在，创建表
    if (!tableExists[0].exists) {
      await pg`
        CREATE TABLE config (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) NOT NULL,
          value TEXT NOT NULL,
          chain_id INT
        );
      `;
      console.log('config表创建成功！');
    }

    // 从config表中查询所有配置
    const result = await pg`SELECT key, value, chain_id FROM config`;

    // 处理配置数据，生成新的数据结构
    const config = {};

    // 处理每个配置项
    result.forEach(row => {
      if (row.chain_id === null) {
        // 如果没有 chain_id，直接使用值
        config[row.key] = row.value;
      } else {
        // 如果有 chain_id，创建或更新嵌套对象
        if (!config[row.key] || typeof config[row.key] === 'string') {
          config[row.key] = {};
        }
        (config[row.key])[row.chain_id] = row.value;
      }
    });

    console.log('数据库中的配置:', config);

    // 读取现有的配置文件
    const configPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../generate/config.json');
    let existingConfig = {};
    try {
      const existingContent = await fs.readFile(configPath, 'utf8');
      existingConfig = JSON.parse(existingContent);
      console.log('现有的配置:', existingConfig);
    } catch (error) {
      // 如果文件不存在或解析失败，使用空对象
      console.log('没有找到现有配置文件或解析失败');
    }

    // 比较配置是否相同
    if (JSON.stringify(config) === JSON.stringify(existingConfig)) {
      console.log('配置没有变化，无需更新');
      return;
    }

    // 确保目录存在
    await fs.ensureDir(path.dirname(configPath));

    // 配置有变化，写入新的配置
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('配置已更新！');
  } catch (error) {
    console.error('同步配置时发生错误:', error);
    process.exit(1);
  }
}

// 执行同步
syncConfigFromDB();