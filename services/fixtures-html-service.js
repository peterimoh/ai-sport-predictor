export function generateFixturesHTML(fixtures, date) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Fixtures - ${formattedDate}</title>
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
        
        .fixtures-section {
            padding: 30px;
        }
        
        .fixtures-grid {
            display: grid;
            gap: 20px;
            margin-top: 20px;
        }
        
        .fixture-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #007bff;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .fixture-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .fixture-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .league-info {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .fixture-time {
            color: #007bff;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .teams {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2rem;
            font-weight: bold;
            margin: 15px 0;
        }
        
        .team {
            flex: 1;
            text-align: center;
        }
        
        .vs {
            color: #6c757d;
            font-size: 1.5rem;
            margin: 0 20px;
        }
        
        .fixture-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        }
        
        .detail-label {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .detail-value {
            color: #2c3e50;
            font-weight: 500;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-ns {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .status-live {
            background: #ffebee;
            color: #d32f2f;
        }
        
        .status-ft {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .no-fixtures {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }
        
        .no-fixtures h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
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
        
        .date-selector {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            text-align: center;
        }
        
        .date-input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 0 10px;
        }
        
        .date-button {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .date-button:hover {
            background: #0056b3;
        }
        
        @media (max-width: 768px) {
            .teams {
                flex-direction: column;
                gap: 10px;
            }
            
            .vs {
                margin: 10px 0;
            }
            
            .fixture-details {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Football Fixtures</h1>
            <div class="subtitle">${formattedDate}</div>
        </div>
        
        <div class="date-selector">
            <form method="GET" action="/fixtures">
                <label for="date">Select Date:</label>
                <input type="date" id="date" name="date" class="date-input" value="${date}">
                <button type="submit" class="date-button">Get Fixtures</button>
            </form>
        </div>
        
        <div class="fixtures-section">
            ${
              fixtures && fixtures.length > 0
                ? generateFixturesList(fixtures)
                : generateNoFixturesMessage()
            }
        </div>
        
        <div style="padding: 20px; text-align: center;">
            <a href="/health" class="back-link">Health Check</a>
            <a href="/predictions" class="back-link" style="margin-left: 10px;">All Predictions</a>
        </div>
    </div>
</body>
</html>`;
}

function generateFixturesList(fixtures) {
  return `
    <h2>Today's Fixtures (${fixtures.length} matches)</h2>
    <div class="fixtures-grid">
      ${fixtures
        .map(
          (fixture) => `
        <div class="fixture-card">
          <div class="fixture-header">
            <div class="league-info">
              ${fixture.league.name} - ${fixture.league.season}
            </div>
            <div class="fixture-time">
              ${formatGameTime(fixture.fixture.date)}
            </div>
          </div>
          
          <div class="teams">
            <div class="team">${fixture.teams.home.name}</div>
            <div class="vs">VS</div>
            <div class="team">${fixture.teams.away.name}</div>
          </div>
          
          <div class="fixture-details">
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span class="status-badge status-${fixture.fixture.status.short.toLowerCase()}">${
            fixture.fixture.status.long
          }</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Venue:</span>
              <span class="detail-value">${
                fixture.fixture.venue.name || 'TBD'
              }</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Round:</span>
              <span class="detail-value">${fixture.league.round}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fixture ID:</span>
              <span class="detail-value">
                <a href="/prediction/${
                  fixture.fixture.id
                }/html" style="color: #007bff; text-decoration: none;">
                  ${fixture.fixture.id}
                </a>
              </span>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function generateNoFixturesMessage() {
  return `
    <div class="no-fixtures">
      <h3>No fixtures found for this date</h3>
      <p>Try selecting a different date to see available matches.</p>
    </div>
  `;
}

function formatGameTime(dateString) {
  const gameDate = new Date(dateString);
  const now = new Date();
  const timeDiff = gameDate.getTime() - now.getTime();
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

  // Format the time in local timezone
  const timeString = gameDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
    hour12: true,
  });

  // Add relative time information
  let relativeTime = '';
  if (timeDiff < 0) {
    // Game has already started or finished
    if (Math.abs(hoursDiff) < 1) {
      relativeTime = ' (Started)';
    } else {
      relativeTime = ' (Finished)';
    }
  } else if (timeDiff < 30 * 60 * 1000) {
    // Less than 30 minutes
    relativeTime = ' (Starting soon)';
  } else if (timeDiff < 2 * 60 * 60 * 1000) {
    // Less than 2 hours
    relativeTime = ` (in ${Math.floor(minutesDiff / 60)}h ${
      minutesDiff % 60
    }m)`;
  } else if (timeDiff < 24 * 60 * 60 * 1000) {
    // Less than 24 hours
    relativeTime = ` (in ${hoursDiff}h)`;
  }

  return `${timeString}${relativeTime}`;
}
