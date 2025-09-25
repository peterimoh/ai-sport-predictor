import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_SPORTS_KEY = process.env.API_SPORTS_KEY;
const TIMEZONE = 'Nigeria/Lagos';

const apiSports = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_SPORTS_KEY },
  timeout: 10000,
});

export async function getFixtures(date) {
  const fixtureDate = date || new Date().toISOString().split('T')[0];

  const response = await apiSports.get(
    `/fixtures?date=${fixtureDate}&status=NS&timezone=${TIMEZONE}`
  );
  return response.data.response;
}

export async function getFixture(fixtureId) {
  const response = await apiSports.get(`/fixtures?id=${fixtureId}`);
  return response.data?.response[0] || null;
}

export async function getFixtureHead2Head(homeId, awayId) {
  const response = await apiSports.get(
    `/fixtures/headtohead?h2h=${homeId}-${awayId}`
  );
  return response.data?.response || null;
}

export async function getTeamStatistics(teamId, leagueId, season) {
  const response = await apiSports.get(
    `/teams/statistics?league=${leagueId}&team=${teamId}&season=${season}`
  );
  return response.data?.response || null;
}

export async function getThirdPartyPrediction(fixtureId) {
  const response = await apiSports.get(`/predictions?fixture=${fixtureId}`);
  return response.data?.response || null;
}
