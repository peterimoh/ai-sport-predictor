import { getFixtures } from '../api-sport/index.js';
import { saveToFile, loadFromFileIfExists } from '../utils/index.js';

export async function getFixturesWithCache(date) {
  const cachedFixtures = await loadFromFileIfExists(`fixtures_${date}.json`);

  if (cachedFixtures) {
    return cachedFixtures;
  }

  try {
    const fixtures = await getFixtures(date);
    await saveToFile(fixtures, `fixtures_${date}.json`);
    return fixtures;
  } catch (apiError) {
    console.log('error retrieving fixtures ======> ', apiError);
  }
}
