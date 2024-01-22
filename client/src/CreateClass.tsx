import React, { useState } from 'react';
import axios from 'axios';

interface CreateClassProps {
  studentEmail: string;
  refreshClasses: () => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ studentEmail, refreshClasses }) => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentEmail === "schennam@utexas.edu") {
      try {
        await axios.post('https://curvecracker-c4e9470535d7.herokuapp.com/api/class/create', { name, identifier });
        setSuccessMessage('Class created successfully.');
        refreshClasses();
        setName('');
        setIdentifier('');
      } catch (error) {
        console.error('Error creating class', error);
      }
    }
  };

  if (studentEmail !== "schennam@utexas.edu") return null;

  return (
    <div className='form-container'>
      <h2 className="form-title">Create Class</h2>
      <form onSubmit={handleSubmit} className="form-field">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class Name"
          className="form-input mb-4"
        />
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Identifier"
          className="form-input mb-4"
        />
        <button type="submit" className="form-button">Create Class</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreateClass;