import React from 'react';

const LandingPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{landingData.title}</h1>
      <p>{landingData.message}</p>
    </div>
  );
};

export default LandingPage;