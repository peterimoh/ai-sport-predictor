import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = './data';

export async function loadFromFileIfExists(fileName) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}
