import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">CurveCracker</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/dashboard" className="hover:text-blue-200">Dashboard</a></li>
            {/* Additional navigation links can be added here */}
          </ul>
        </nav>
        <div>
          {/* Authentication buttons will be added here */}
        </div>
      </div>
    </header>
  );
};

export default Header;