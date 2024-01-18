import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 p-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 CurveCracker. All rights reserved.</p>
        {/* Additional footer information can be added here */}
      </div>
    </footer>
  );
};

export default Footer;