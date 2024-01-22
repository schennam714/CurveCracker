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
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Class Name" />
      <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Identifier" />
      <button type="submit">Create Class</button>
    </form>
  );
};

export default CreateClass;