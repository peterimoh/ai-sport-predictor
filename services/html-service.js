export function generatePredictionHTML(fixtureId, prediction, combinedData) {
  const fixture = combinedData?.fixture;
  const homeTeam = fixture?.teams?.home?.name || 'Home Team';
  const awayTeam = fixture?.teams?.away?.name || 'Away Team';
  const league = fixture?.league?.name || 'League';
  const season = fixture?.league?.season || 'Season';
  const date = fixture?.fixture?.date
    ? new Date(fixture.fixture.date).toLocaleDateString()
    : 'TBD';

  // Parse the prediction data
  let parsedPrediction = null;
  if (prediction.raw && !prediction.error) {
    try {
      // Extract JSON from the raw response
      const jsonMatch = prediction.raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPrediction = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Could not parse prediction JSON');
    }
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Prediction - ${homeTeam} vs ${awayTeam}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .match-info {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .match-info h2 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .teams {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.3rem;
            font-weight: bold;
        }
        
        .vs {
            color: #6c757d;
            font-size: 1.5rem;
        }
        
        .prediction-section {
            padding: 30px;
        }
        
        .prediction-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }
        
        .prediction-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #007bff;
        }
        
        .prediction-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .prediction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .prediction-item:last-child {
            border-bottom: none;
        }
        
        .prediction-label {
            font-weight: 500;
            color: #495057;
        }
        
        .prediction-value {
            font-weight: bold;
            color: #007bff;
        }
        
        .confidence-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        
        .raw-data {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .raw-data h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .raw-content {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #f5c6cb;
            margin-top: 20px;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .back-link:hover {
            background: #0056b3;
        }
        
        @media (max-width: 768px) {
            .teams {
                flex-direction: column;
                gap: 10px;
            }
            
            .prediction-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AI Football Prediction</h1>
            <div class="subtitle">Fixture ID: ${fixtureId}</div>
        </div>
        
        <div class="match-info">
            <h2>Match Information</h2>
            <div class="teams">
                <span>${homeTeam}</span>
                <span class="vs">VS</span>
                <span>${awayTeam}</span>
            </div>
            <p style="text-align: center; margin-top: 10px; color: #6c757d;">
                ${league} - ${season} | ${date}
            </p>
        </div>
        
        <div class="prediction-section">
            ${
              parsedPrediction
                ? generatePredictionContent(parsedPrediction)
                : generateRawContent(prediction)
            }
        </div>
        
        <div style="padding: 20px; text-align: center;">
            <a href="/prediction/${fixtureId}" class="back-link">View JSON API</a>
            <a href="/predictions" class="back-link" style="margin-left: 10px;">All Predictions</a>
        </div>
    </div>
</body>
</html>`;
}

function generatePredictionContent(prediction) {
  let html = '<h2>AI Predictions</h2><div class="prediction-grid">';

  // Match Result
  if (prediction.match_result) {
    html += `
    <div class="prediction-card">
        <h3>Match Result</h3>
        <div class="prediction-item">
            <span class="prediction-label">Home Win</span>
            <span class="prediction-value">${prediction.match_result.home_win}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Draw</span>
            <span class="prediction-value">${prediction.match_result.draw}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Away Win</span>
            <span class="prediction-value">${prediction.match_result.away_win}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Most Likely</span>
            <span class="prediction-value">${prediction.match_result.most_likely}</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Confidence</span>
            <span class="prediction-value">${prediction.match_result.confidence}%</span>
        </div>
        <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${prediction.match_result.confidence}%"></div>
        </div>
    </div>`;
  }

  // Both Teams Score
  if (prediction.both_teams_score) {
    html += `
    <div class="prediction-card">
        <h3>Both Teams Score</h3>
        <div class="prediction-item">
            <span class="prediction-label">Yes</span>
            <span class="prediction-value">${prediction.both_teams_score.yes}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">No</span>
            <span class="prediction-value">${prediction.both_teams_score.no}%</span>
        </div>
    </div>`;
  }

  // Total Goals
  if (prediction.total_goals) {
    html += `
    <div class="prediction-card">
        <h3>Total Goals</h3>
        <div class="prediction-item">
            <span class="prediction-label">Under 1.5</span>
            <span class="prediction-value">${prediction.total_goals.under_1_5}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Over 1.5</span>
            <span class="prediction-value">${prediction.total_goals.over_1_5}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Under 2.5</span>
            <span class="prediction-value">${prediction.total_goals.under_2_5}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Over 2.5</span>
            <span class="prediction-value">${prediction.total_goals.over_2_5}%</span>
        </div>
    </div>`;
  }

  // Team Goals
  if (prediction.team_goals) {
    html += `
    <div class="prediction-card">
        <h3>Team Goals</h3>
        <div class="prediction-item">
            <span class="prediction-label">Home 2+ Goals</span>
            <span class="prediction-value">${prediction.team_goals.home_2_plus}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Away 2+ Goals</span>
            <span class="prediction-value">${prediction.team_goals.away_2_plus}%</span>
        </div>
    </div>`;
  }

  // Corners
  if (prediction.corners) {
    html += `
    <div class="prediction-card">
        <h3>Corners</h3>
        <div class="prediction-item">
            <span class="prediction-label">Total Over 8.5</span>
            <span class="prediction-value">${prediction.corners.total_corners_over_8_5}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">First Corner Home</span>
            <span class="prediction-value">${prediction.corners.first_corner_home}%</span>
        </div>
        <div class="prediction-item">
            <span class="prediction-label">Most Corners</span>
            <span class="prediction-value">${prediction.corners.most_corners}</span>
        </div>
    </div>`;
  }

  html += '</div>';
  return html;
}

function generateRawContent(prediction) {
  return `
    <h2>AI Prediction</h2>
    <div class="raw-data">
        <h3>Raw AI Response</h3>
        <div class="raw-content">${
          prediction.raw || 'No raw data available'
        }</div>
    </div>
  `;
}

export function generateNoPredictionHTML(fixtureId) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No Prediction Available - Fixture ${fixtureId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 600px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            text-align: center;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 40px 30px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .icon {
            font-size: 4rem;
            color: #6c757d;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 1.3rem;
            color: #495057;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .generate-btn {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,123,255,0.3);
        }
        
        .generate-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .loading {
            display: none;
            margin-top: 20px;
        }
        
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #007bff;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            color: #6c757d;
            font-size: 1rem;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .back-link:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>No Prediction Available</h1>
            <div class="subtitle">Fixture ID: ${fixtureId}</div>
        </div>
        
        <div class="content">
            <div class="icon">🤖</div>
            <div class="message">
                No AI prediction has been generated for this fixture yet.
                <br><br>
                Click the button below to generate an AI prediction using our advanced machine learning model.
            </div>
            
            <button class="generate-btn" onclick="generatePrediction()" id="generateBtn">
                Generate AI Prediction
            </button>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <div class="loading-text">Generating prediction... This may take a few moments.</div>
            </div>
            
            <div style="margin-top: 30px;">
                <a href="/predictions" class="back-link">View All Predictions</a>
            </div>
        </div>
    </div>

    <script>
        async function generatePrediction() {
            const btn = document.getElementById('generateBtn');
            const loading = document.getElementById('loading');
            
            // Show loading state
            btn.disabled = true;
            btn.textContent = 'Generating...';
            loading.style.display = 'block';
            
            try {
                const response = await fetch(\`/predict/\${${fixtureId}}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                
                if (response.ok) {
                    // Success - redirect to the prediction page
                    window.location.href = \`/prediction/\${${fixtureId}}/html\`;
                } else {
                    const error = await response.json();
                    alert('Error generating prediction: ' + (error.error || 'Unknown error'));
                    resetButton();
                }
            } catch (error) {
                alert('Network error: ' + error.message);
                resetButton();
            }
        }
        
        function resetButton() {
            const btn = document.getElementById('generateBtn');
            const loading = document.getElementById('loading');
            
            btn.disabled = false;
            btn.textContent = 'Generate AI Prediction';
            loading.style.display = 'none';
        }
    </script>
</body>
</html>`;
}
