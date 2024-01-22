import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface JoinClassProps {
  studentId: string;
  refreshClasses: () => void; 
}

const JoinClass: React.FC<JoinClassProps> = ({ studentId, refreshClasses }) => {
  const [identifier, setIdentifier] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.post('https://curvecracker-c4e9470535d7.herokuapp.com/api/class/join', { studentId, classIdentifier: identifier });
      setSuccessMessage('Successfully joined the class.');
      setIdentifier('');
      refreshClasses(); 
    } catch (error: any) {
      setErrorMessage('Error joining class: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className='form-container'>
      <h2 className="form-title">Join Class</h2>
      <form onSubmit={handleSubmit} className="form-field">
        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Class Identifier" className='form-input'/>
        <button type="submit" className='form-button'>Join Class</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default JoinClass;
