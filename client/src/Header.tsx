import React from 'react';
import { useAuth } from './Authcontext';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">CurveCracker</h1>
        {isLoggedIn && (
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/dashboard" className="hover:text-blue-200">Dashboard</a></li>
          </ul>
        </nav>
      )}
        <div>
        </div>
      </div>
    </header>
  );
};

export default Header;