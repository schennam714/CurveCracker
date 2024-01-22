import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import './Dashboard.css'

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
      const response = await axios.get(`https://curvecracker-c4e9470535d7.herokuapp.com/api/student/classes/${studentId}`);
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
        await axios.post('https://curvecracker-c4e9470535d7.herokuapp.com/api/student/leave', { studentId, classIdentifier });
        fetchClasses(); 
    } catch (error) {
        console.error('Error leaving class', error);
    }
};

  return (
    <div className="container mx-auto p-4">
      <h1>Your Classes</h1>
      <div className='classes-container'>
        {classes.map((classData) => (
          <div key={classData.classId} className="class-box">
            <h3 className='class-title'>{classData.className}</h3>
            <p className="class-identifier">{classData.identifier}</p>
            <button onClick={() => handleLeaveClass(classData.identifier)}>Leave Class</button>
          </div>
        ))}
      </div>
      <CreateClass studentEmail={studentEmail} refreshClasses={fetchClasses}/> 
      <JoinClass studentId={studentId} refreshClasses={fetchClasses}/>
    </div>
  );
};

export default Dashboard;
