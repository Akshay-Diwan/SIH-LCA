import React from 'react';

const GradientTitle: React.FC = () => {
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 leading-tight">
      Welcome to Your SaaS Dashboard
    </h1>
  );
};

export default GradientTitle;