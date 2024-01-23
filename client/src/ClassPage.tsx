import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


interface DistributionData {
  score: number;
  rank: number;
  percentile: number;
}

const ClassPage: React.FC = () => {
  const { classIdentifier } = useParams<{ classIdentifier: string }>();
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [score, setScore] = useState('');
  const studentId = localStorage.getItem('studentId') || '';
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDistribution = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Class identifier" + classIdentifier);
      const response = await axios.get(`https://curvecracker-c4e9470535d7.herokuapp.com/api/student/distribution/${classIdentifier}/${studentId}`);
      setDistribution(response.data);
    } catch (error) {
      console.error('Error fetching distribution', error);
    }
    finally {
        setIsLoading(false);
    }
  }, [classIdentifier, studentId]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  
  const handleSubmitScore = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) throw new Error('Student ID missing');

      const response = await axios.post('https://curvecracker-c4e9470535d7.herokuapp.com/api/student/submitScore/', {
        studentId,
        classIdentifier,
        score
      });
      console.log(response.data);
      fetchDistribution();
    } catch (error) {
      console.error('Error submitting score:', error);
      // Handle error later in JSX
    }
  };

  return (
    <div className="container mx-auto p-4">
      {distribution ? (
        <>
        <h1>Your performance</h1>
        <p>Score: {distribution.score}</p>
        <p>Rank: {distribution.rank}</p>
        <p>Percentile: {distribution.percentile.toFixed(2)}%</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <form onSubmit={handleSubmitScore}>
        <input
          type="number"
          value={score}
          onChange={e => setScore(e.target.value)}
          placeholder="Enter your score"
        />
        <button type="submit">Submit Score</button>
      </form>
    </div>
  );
};

export default ClassPage;
