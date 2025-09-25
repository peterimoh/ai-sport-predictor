import { getPredictionFromGemini } from '../services/ai-service.js';
import {
  generatePredictionHTML,
  generateNoPredictionHTML,
} from '../services/html-service.js';
import { getFixturesWithCache } from '../services/fixtures-service.js';
import { generateFixturesHTML } from '../services/fixtures-html-service.js';
import { saveToFile, loadFromFileIfExists } from '../utils/index.js';
import {
  getFixture,
  getFixtureHead2Head,
  getTeamStatistics,
  getThirdPartyPrediction,
} from '../api-sport/index.js';

export function registerPredictionRoutes(fastify) {
  fastify.post('/predict/:fixtureId', async (req, reply) => {
    const fixtureId = Number(req.params.fixtureId);

    try {
      if (!fixtureId || isNaN(fixtureId)) {
        return reply.code(400).send({ error: 'Invalid fixture ID' });
      }

      fastify.log.info(`Starting prediction for fixture ${fixtureId}`);

      // 1) Check if combined data already exists
      const existingData = await loadFromFileIfExists(
        `combined_data_${fixtureId}.json`
      );
      if (existingData) {
        fastify.log.info(`Using cached data for fixture ${fixtureId}`);
        const aiPrediction = await getPredictionFromGemini(existingData);
        await saveToFile(aiPrediction, `ai_prediction_${fixtureId}.json`);

        return {
          success: true,
        };
      }

      // 2) Otherwise fetch fresh data
      const fixture = await getFixture(fixtureId);
      if (!fixture) {
        return reply.code(404).send({ error: 'Fixture not found' });
      }

      const { league, teams } = fixture;

      const [h2h, homeTeamStats, awayTeamStats, thirdPartyPrediction] =
        await Promise.all([
          getFixtureHead2Head(teams.home.id, teams.away.id),
          getTeamStatistics(teams.home.id, league.id, '2023'),
          getTeamStatistics(teams.away.id, league.id, '2023'),
          getThirdPartyPrediction(fixtureId),
        ]);

      const combinedData = {
        fixtureId,
        timestamp: new Date().toISOString(),
        fixture,
        h2h,
        homeTeamStats,
        awayTeamStats,
        thirdPartyPrediction: thirdPartyPrediction?.[0] || null,
      };

      // Save combined data (no timestamp in filename → reusable)
      await saveToFile(combinedData, `combined_data_${fixtureId}.json`);

      // Generate AI prediction
      const aiPrediction = await getPredictionFromGemini(combinedData);
      console.log(aiPrediction);

      return {
        success: true,
        fixtureId,
        fixture: {
          league: league.name,
          season: league.season,
          homeTeam: teams.home.name,
          awayTeam: teams.away.name,
        },
        thirdPartyPrediction: thirdPartyPrediction?.[0] || null,
        aiPrediction,
        combined: combinedData,
      };
    } catch (error) {
      fastify.log.error(
        `Error processing fixture ${fixtureId}:`,
        error.message
      );

      if (error.response?.status === 429) {
        return reply
          .code(429)
          .send({ error: 'API rate limit exceeded. Please try again later.' });
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
        return reply
          .code(503)
          .send({ error: 'External API service unavailable' });
      }

      return reply
        .code(500)
        .send({ error: 'Internal server error', message: error.message });
    }
  });

  fastify.get('/prediction/:fixtureId', async (req, reply) => {
    const fixtureId = Number(req.params.fixtureId);

    try {
      if (!fixtureId || isNaN(fixtureId)) {
        return reply.code(400).send({ error: 'Invalid fixture ID' });
      }

      const prediction = await loadFromFileIfExists(
        `ai_prediction_${fixtureId}.json`
      );
      if (!prediction) {
        return reply
          .code(404)
          .send({ error: 'Prediction not found for this fixture' });
      }

      return {
        success: true,
        fixtureId,
        prediction,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      fastify.log.error(
        `Error retrieving prediction for fixture ${fixtureId}:`,
        error.message
      );
      return reply
        .code(500)
        .send({ error: 'Internal server error', message: error.message });
    }
  });

  // Get AI prediction in HTML format
  fastify.get('/prediction/:fixtureId/html', async (req, reply) => {
    const fixtureId = Number(req.params.fixtureId);

    try {
      if (!fixtureId || isNaN(fixtureId)) {
        return reply.code(400).send({ error: 'Invalid fixture ID' });
      }

      const prediction = await loadFromFileIfExists(
        `ai_prediction_${fixtureId}.json`
      );
      if (!prediction) {
        // Return HTML page with "no prediction" message and generate button
        const html = generateNoPredictionHTML(fixtureId);
        reply.type('text/html');
        return html;
      }

      // Get combined data for additional context
      const combinedData = await loadFromFileIfExists(
        `combined_data_${fixtureId}.json`
      );

      const html = generatePredictionHTML(fixtureId, prediction, combinedData);

      reply.type('text/html');
      return html;
    } catch (error) {
      fastify.log.error(
        `Error retrieving prediction for fixture ${fixtureId}:`,
        error.message
      );
      return reply
        .code(500)
        .send({ error: 'Internal server error', message: error.message });
    }
  });

  // Get all available predictions
  fastify.get('/predictions', async (req, reply) => {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir('./data');
      const predictionFiles = files.filter(
        (file) => file.startsWith('ai_prediction_') && file.endsWith('.json')
      );

      const predictions = [];
      for (const file of predictionFiles) {
        const fixtureId = file
          .replace('ai_prediction_', '')
          .replace('.json', '');
        const prediction = await loadFromFileIfExists(file);
        if (prediction) {
          predictions.push({
            fixtureId: Number(fixtureId),
            hasRawData: !!prediction.raw,
            hasParsedData: !prediction.error,
            timestamp: new Date().toISOString(),
          });
        }
      }

      return {
        success: true,
        count: predictions.length,
        predictions,
      };
    } catch (error) {
      fastify.log.error('Error retrieving predictions list:', error.message);
      return reply
        .code(500)
        .send({ error: 'Internal server error', message: error.message });
    }
  });

  // Get fixtures for a specific date (cached)
  fastify.get('/fixtures/:date?', async (req, reply) => {
    const date = req.params.date || new Date().toISOString().split('T')[0];

    try {
      const fixtures = await getFixturesWithCache(date);
      const html = generateFixturesHTML(fixtures, date);

      reply.type('text/html');
      return html;
    } catch (error) {
      fastify.log.error(
        `Error retrieving fixtures for date ${date}:`,
        error.message
      );
      return reply
        .code(500)
        .send({ error: 'Internal server error', message: error.message });
    }
  });
}
