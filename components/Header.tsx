
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
    </header>
  );
};

export default Header;
