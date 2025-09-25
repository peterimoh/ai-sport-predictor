export async function populatePromptTemplate(combinedData){
    const {fixtureId, fixture: combinedFixture, thirdPartyPrediction} = combinedData

    const {fixture, league, } = combinedFixture
    const {predictions, comparison, teams} =thirdPartyPrediction

    return `
    # Football Match Prediction Analysis Prompt

You are an expert football analyst with deep knowledge of La Liga and European football. Analyze the provided match data comprehensively to generate accurate predictions for the upcoming fixture.

## Match Information
- **Fixture ID**: ${fixtureId}
- **Match**: ${teams.home.name} vs ${teams.away.name}
- **Venue**: ${fixture.venue.name}, ${fixture.venue.city}
- **League**: ${league.name}
- **Season**: ${league.season}
- **Round**: ${league.round}
- **Date**: ${fixture.date}

## Analysis Framework

### 1. Current Season Form Analysis
Based on the provided current season statistics:

**Home Team (${teams.home.name}):**
- Form: ${teams.home.league.form}
- Home record: ${teams.home.league.fixtures.wins.home}W-${teams.home.league.fixtures.draws.home}D-${teams.home.league.fixtures.loses.home}L
- Away record: ${teams.home.league.fixtures.wins.away}W-${teams.home.league.fixtures.draws.away}D-${teams.home.league.fixtures.loses.away}L
- Goals scored: ${teams.home.league.goals.for.total.total} (${teams.home.league.goals.for.average.total} avg)
- Goals conceded: ${teams.home.league.goals.against.total.total} (${teams.home.league.goals.against.average.total} avg)
- Clean sheets: ${teams.home.league.clean_sheet.total}
- Failed to score: ${teams.home.league.failed_to_score.total}

**Away Team (${teams.away.name}):**
- Form: ${teams.away.league.form}
- Home record: ${teams.away.league.fixtures.wins.home}W-${teams.away.league.fixtures.draws.home}D-${teams.away.league.fixtures.loses.home}L
- Away record: ${teams.away.league.fixtures.wins.away}W-${teams.away.league.fixtures.draws.away}D-${teams.away.league.fixtures.loses.away}L
- Goals scored: ${teams.away.league.goals.for.total.total} (${teams.away.league.goals.for.average.total} avg)
- Goals conceded: ${teams.away.league.goals.against.total.total} (${teams.away.league.goals.against.average.total} avg)
- Clean sheets: ${teams.away.league.clean_sheet.total}
- Failed to score: ${teams.away.league.failed_to_score.total}

### 2. Head-to-Head Historical Analysis
Analyze the last 10 encounters between these teams, noting:
- Overall head-to-head record
- Recent trends (last 3-5 meetings)
- Home/away venue performance patterns
- Goal-scoring patterns in this fixture
- Common scorelines
- Performance when roles are reversed (home/away)

### 3. Tactical and Performance Indicators

**Goal Timing Analysis:**
- Examine when goals are typically scored/conceded by each team
- First/second half tendencies
- Late goal vulnerability/strength

**Disciplinary Record:**
- Yellow/red card patterns
- Impact on match flow and results

**Venue Analysis:**
- Home team's fortress factor
- Away team's travel record
- Historical performance at this specific venue

### 4. Third-Party Prediction Comparison
Reference the API prediction data:
- Winner prediction: ${predictions.winner.name}
- Percentages: Home ${predictions.percent.home}, Draw ${predictions.percent.draw}, Away ${predictions.percent.away}
- Advice: ${predictions.advice}
- Form comparison: ${comparison.form.home} vs ${comparison.form.away}
- H2H advantage: ${comparison.h2h.home} vs ${comparison.h2h.away}

## Required Predictions

Provide detailed predictions with confidence levels (0-100%) and reasoning for each:

### 1. Match Result
\`\`\`json
{
  "HomeWin": X%,
  "Draw": X%,
  "AwayWin": X%,
  "MostLikely": "Home/Draw/Away",
  "Confidence": X%,
  "Reasoning": "Detailed analysis based on form, h2h, venue factors..."
}
\`\`\`

### 2. Goal-Based Predictions
\`\`\`json
{
  "BothTeamsToScore": {
    "Yes": X%,
    "No": X%,
    "Reasoning": "Based on scoring/defensive records..."
  },
  "TotalGoals": {
    "Under1.5": X%,
    "Over1.5": X%,
    "Under2.5": X%,
    "Over2.5": X%,
    "Under3.5": X%,
    "Over3.5": X%,
    "MostLikely": "X-X goals",
    "Reasoning": "Goal-scoring patterns analysis..."
  },
  "TeamGoals": {
    "HomeTeam2Plus": X%,
    "HomeTeam3Plus": X%,
    "AwayTeam2Plus": X%,
    "AwayTeam3Plus": X%,
    "Reasoning": "Individual team scoring capabilities..."
  }
}
\`\`\`

### 3. Corner Kicks Predictions
\`\`\`json
{
  "Corners": {
    "HomeTeamCorners": {
      "Over4.5": X%,
      "Over6.5": X%,
      "Reasoning": "Attack patterns, playing style, opponent defensive setup..."
    },
    "AwayTeamCorners": {
      "Over4.5": X%,
      "Over6.5": X%,
      "Reasoning": "Away attacking approach, home defensive style..."
    },
    "TotalCorners": {
      "Over8.5": X%,
      "Over10.5": X%,
      "Under8.5": X%,
      "Reasoning": "Combined attacking styles, match tempo expectations..."
    },
    "FirstCorner": "Home/Away",
    "MostCorners": "Home/Away/Equal"
  }
}
\`\`\`

### 4. Timing-Based Predictions
\`\`\`json
{
  "GoalTiming": {
    "FirstHalfGoals": X%,
    "SecondHalfGoals": X%,
    "FirstGoalBefore30min": X%,
    "LateGoal_After75min": X%,
    "Reasoning": "Goal timing patterns from historical data..."
  },
  "HalfTimeResult": {
    "HomeLeading": X%,
    "Draw": X%,
    "AwayLeading": X%,
    "Reasoning": "Early game patterns and strategies..."
  }
}
\`\`\`

### 5. Disciplinary Predictions
\`\`\`json
{
  "Cards": {
    "TotalYellowCards": {
      "Over3.5": X%,
      "Under3.5": X%
    },
    "RedCard": X%,
    "MostCards": "Home/Away",
    "Reasoning": "Historical disciplinary records, referee tendencies..."
  }
}
\`\`\`

## Critical Analysis Points

1. **Data Limitations**: Note any missing seasonal statistics (2025 season data unavailable in free tier)
2. **Form vs History**: Weight recent form against historical h2h records
3. **Venue Impact**: Consider home advantage strength
4. **Motivation Factors**: League position, recent results momentum
5. **Tactical Matchups**: Playing styles compatibility
6. **Injury/Suspension Impact**: If mentioned in context

## Output Format

Provide your analysis in the exact JSON structure specified above, ensuring:
- All percentages sum to 100% where applicable
- Confidence levels are realistic (avoid overconfidence)
- Reasoning is specific and data-driven
- Predictions are internally consistent
- Consider multiple scenarios and hedge appropriately

## Important Notes

- Base predictions on quantitative data from the provided statistics
- Use historical patterns to inform corner kick predictions
- Consider venue factors for all predictions
- Account for team motivation and current league standing
- Be conservative with confidence levels for unusual predictions
- Explain any predictions that go against the third-party API suggestions

Remember: Provide actionable insights while acknowledging the inherent uncertainty in football predictions.`;
}
