/**
 * Shared Course Summary Generator
 * 
 * Generates course summary from challenge results.
 * Used by all course review engines to avoid duplication.
 */

/**
 * Generate course summary from challenge results
 * @param {Array} challengeResults - Array of challenge result objects
 * @param {Object} config - Course configuration from course-config.json
 * @param {Object|null} [learnerSelection] - Optional learner selection data { selectedChallenges: string[] }
 * @returns {Object} Course summary object
 */
export function generateCourseSummary(challengeResults, config, learnerSelection = null) {
  const selectionRules = config.selectionRules;

  let totalChallenges, completedChallenges, averageScore, completionPercentage;

  if (selectionRules?.enabled && learnerSelection?.selectedChallenges?.length > 0) {
    // For selection-based courses (e.g. Course 4): base calculations on selected challenges only.
    // The required count is the sum of all tier requirements (e.g. 2+2+2 = 6).
    const totalRequired = selectionRules.totalRequired ||
      Object.values(selectionRules.tiers).reduce((sum, t) => sum + t.required, 0);
    const selectedIds = new Set(learnerSelection.selectedChallenges);
    const selectedResults = challengeResults.filter(r => selectedIds.has(r.challengeId));
    const passedSelected = selectedResults.filter(r => r.passed);

    // Check if all tier requirements are met
    const challengeMetaMap = new Map(
      challengeResults.map(r => [r.challengeId, r])
    );
    // Build tier→difficulty map from config challenges (difficulty is stored in metadata, not config)
    // Fall back to checking per-tier from selectionRules by looking at results tagged with difficulty.
    // We rely on challenge IDs in selectedChallenges and results having no tier info at this level,
    // so use a simpler check: all tier requirements are met when passedSelected.length >= totalRequired
    // AND each tier's required count is satisfied (requires difficulty info on results if available).
    // For robustness, also support simple count-based check.
    const allTiersMet = (() => {
      // Try per-tier check using result.difficulty if present
      const tiers = selectionRules.tiers;
      const tierKeys = Object.keys(tiers);
      const hasDifficulty = selectedResults.some(r => r.difficulty);
      if (hasDifficulty) {
        return tierKeys.every(tier => {
          const passedInTier = selectedResults.filter(
            r => r.passed && (r.difficulty === tier)
          ).length;
          return passedInTier >= tiers[tier].required;
        });
      }
      // Fallback: just check total selected passed >= totalRequired
      return passedSelected.length >= totalRequired;
    })();

    totalChallenges = totalRequired;
    completedChallenges = Math.min(passedSelected.length, totalRequired);
    averageScore = selectedResults.length > 0
      ? selectedResults.reduce((sum, r) => sum + r.totalScore, 0) / selectedResults.length
      : 0;
    completionPercentage = allTiersMet ? 100 : (totalRequired > 0
      ? (completedChallenges / totalRequired) * 100
      : 0);
  } else if (selectionRules?.enabled) {
    // Selection rules enabled but no selection made yet — treat as 0 / totalRequired
    const totalRequired = selectionRules.totalRequired ||
      Object.values(selectionRules.tiers).reduce((sum, t) => sum + t.required, 0);
    totalChallenges = totalRequired;
    completedChallenges = 0;
    averageScore = 0;
    completionPercentage = 0;
  } else {
    // Standard courses: all challenges must be passed
    totalChallenges = config.challenges.length;
    completedChallenges = challengeResults.filter(r => r.passed).length;
    averageScore = challengeResults.length > 0
      ? challengeResults.reduce((sum, r) => sum + r.totalScore, 0) / challengeResults.length
      : 0;
    completionPercentage = totalChallenges > 0
      ? (completedChallenges / totalChallenges) * 100
      : 0;
  }

  // Determine badge level (using hardcoded thresholds for course-level badges)
  // Note: Pathway-level badges use config from pathway-config.json
  const badgeLevels = {
    gold: { minScore: 90, minCompletion: 100 },
    silver: { minScore: 75, minCompletion: 75 },
    bronze: { minScore: 60, minCompletion: 50 }
  };

  let badgeLevel = 'none';
  if (averageScore >= badgeLevels.gold.minScore && completionPercentage >= badgeLevels.gold.minCompletion) {
    badgeLevel = 'gold';
  } else if (averageScore >= badgeLevels.silver.minScore && completionPercentage >= badgeLevels.silver.minCompletion) {
    badgeLevel = 'silver';
  } else if (averageScore >= badgeLevels.bronze.minScore && completionPercentage >= badgeLevels.bronze.minCompletion) {
    badgeLevel = 'bronze';
  }

  // Identify strengths and improvements
  const strengths = challengeResults
    .filter(r => r.totalScore >= 80)
    .map(r => r.challengeName);

  const improvements = challengeResults
    .filter(r => r.totalScore < 70)
    .map(r => r.challengeName);

  return {
    courseId: config.courseId,
    courseName: config.courseName,
    lastUpdated: new Date().toISOString(),
    totalChallenges,
    completedChallenges,
    averageScore: Math.round(averageScore * 10) / 10,
    completionPercentage: Math.round(completionPercentage * 10) / 10,
    badgeLevel,
    challengeResults: challengeResults.map(r => ({
      challengeId: r.challengeId,
      challengeName: r.challengeName,
      score: r.totalScore,
      passed: r.passed
    })),
    skillStrengths: strengths,
    improvementAreas: improvements
  };
}
