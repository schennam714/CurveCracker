import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import { useAuth } from './Authcontext';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';

interface ClassData {
    classId: string;
    className: string;
    identifier: string
  }

const Dashboard: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const studentId = localStorage.getItem('studentId') || '';

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/classes/${studentId}`);
      setClasses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching classes', error);
    }
  }, [studentId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const studentEmail = localStorage.getItem('studentEmail') || '';

  const handleLeaveClass = async (classIdentifier: string) => {
    try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/student/leave`, { studentId, classIdentifier });
        fetchClasses(); 
    } catch (error) {
        console.error('Error leaving class', error);
    }
  };

  const { setIsLoggedIn } = useAuth(); 
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    setIsLoggedIn(false);
    nav('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className='your-classes-header'>Your Classes</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <div className='classes-container'>
        {classes.map((classData) => (
          <div key={classData.classId} className="class-box">
            <button onClick={() => nav(`/class/${classData.identifier}`)}> Access Grades </button>
            <h3 className='class-title'>{classData.className} </h3>
            <p className="class-identifier">{classData.identifier}</p>
            <button className='leave-class-btn' onClick={() => handleLeaveClass(classData.identifier)}>Leave Class</button>
          </div>
        ))}
      </div>
      <CreateClass studentEmail={studentEmail} refreshClasses={fetchClasses}/> 
      <JoinClass studentId={studentId} refreshClasses={fetchClasses}/>
    </div>
  );
};

export default Dashboard;
