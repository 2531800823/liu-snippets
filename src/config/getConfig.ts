import os from 'os';
import fs from 'fs-extra';
import path from 'path';

const defaultFileDirName = 'import-snippets';
const defaultFileNameConfig = 'import-snippets-config.js';
const defaultFileNameSnippets = path.join(__dirname, 'snippets.js');

export function getPathName(): Promise<string> {
  return new Promise((resolve) => {
    // 临时目录
    const tpmDir = os.homedir();
    // 项目目录
    const projectDir = path.join(tpmDir, defaultFileDirName);
    fs.ensureDirSync(projectDir);
    const filePath = path.join(projectDir, defaultFileNameConfig);

    saveToOsTemp(filePath);

    resolve(filePath);
  });
}

export function saveToOsTemp(filePath: string) {
  if (!fs.existsSync(filePath)) {
    // 文件不存在，写入文件
    fs.writeFileSync(filePath, fs.readFileSync(defaultFileNameSnippets));
    console.info(`File created at ${filePath}`);
  } else {
    console.info(`File already exists at ${filePath}, skipping write.`);
  }
}
