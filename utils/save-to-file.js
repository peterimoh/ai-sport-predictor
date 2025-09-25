import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = './data';

export async function saveToFile(data, fileName) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return filePath;
  } catch (error) {
    console.error(`Error saving file ${fileName}:`, error.message);
    throw error;
  }
}
