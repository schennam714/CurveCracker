function calculateDistribution(scores) {
    scores.sort((a, b) => b - a); 
  
    return scores.map((score, index, arr) => {
      const rank = index + 1; 
      const percentile = ((arr.length - rank) / arr.length) * 100;
      return { score, rank, percentile };
    });
  }
  
  module.exports = calculateDistribution;