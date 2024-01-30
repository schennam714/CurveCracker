import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

interface DistributionData {
  score: number;
  rank: number;
  percentile: number;
}

interface ScoreData {
    studentId: string;
    score: number;
}

const ClassPage: React.FC = () => {
  const { classIdentifier } = useParams<{ classIdentifier: string }>();
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [score, setScore] = useState('');
  const studentId = localStorage.getItem('studentId') || '';
  const [classScores, setClassScores] = useState<ScoreData[]>([]);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [plotLayout, setPlotLayout] = useState({});

  const fetchDistribution = useCallback(async () => {
    try {
      console.log("Class identifier" + classIdentifier);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/distribution/${classIdentifier}/${studentId}`);
      setDistribution(response.data);
    } catch (error) {
      console.error('Error fetching distribution', error);
    }
  }, [classIdentifier, studentId]);

  const fetchClassScores = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/viewScores/${classIdentifier}`);
      setClassScores(response.data);
    } catch (error) {
      console.error('Error fetching class scores', error);
    }
  }, [classIdentifier]);

  useEffect(() => {
    fetchDistribution();
    fetchClassScores();
  }, [fetchDistribution, fetchClassScores]);

  useEffect(() => {
    if (classScores.length > 0) {
      const scores = classScores.map(s => s.score);
      const studentScore = classScores.find(s => s.studentId === studentId)?.score;

      setPlotData([
        {
          y: scores,
          type: 'box',
          name: 'Class Scores',
          marker: { color: 'blue' },
          boxpoints: 'all',
        },
        {
          y: [studentScore],
          type: 'scatter',
          mode: 'markers',
          name: 'Your Score',
          marker: { color: 'red', size: 12 },
        }
      ]);

      setPlotLayout({
        title: 'Score Distribution',
        yaxis: { title: 'Scores' },
        showlegend: true
      });
    }
  }, [classScores, studentId]);
  
  const handleSubmitScore = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) throw new Error('Student ID missing');

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/student/submitScore/`, {
        studentId,
        classIdentifier,
        score
      });
      await fetchDistribution();
      await fetchClassScores();
    } catch (error) {
      console.error('Error submitting score:', error);
      // Handle error later in JSX
    }
  };

  const { setIsLoggedIn } = useAuth(); 
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    nav('/');
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  {distribution ? (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Performance</h1>
      <p className="mb-2 text-lg">Overall Grade: <span className="font-semibold">{distribution.score}</span></p>
      <p className="mb-2 text-lg">Rank: <span className="font-semibold">{distribution.rank}</span></p>
      <p className="mb-4 text-lg">Percentile: <span className="font-semibold">{distribution.percentile.toFixed(2)}%</span></p>
    </div>
  ) : (
    <p className="text-center text-lg">Loading...</p>
  )}
  <form onSubmit={handleSubmitScore} className="mt-4">
    <div className="mb-4">
      <input
        type="number"
        value={score}
        onChange={e => setScore(e.target.value)}
        placeholder="Enter your score"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Submit Score
    </button>
  </form>
      {classScores.length > 0 && (
        <div className="mt-8">
          <Plot
            data={plotData}
            layout={plotLayout}
          />
        </div>
      )}
  <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default ClassPage;
