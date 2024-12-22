import fs from 'fs-extra';

export function removeConfig(filePath: string) {
  fs.removeSync(filePath);
}
