import React from 'react';
import { useParams } from 'react-router-dom';

const Results = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Election Results</h1>
          <p className="text-gray-600 mb-8">Election ID: {id}</p>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p>Results visualization will be implemented here with charts and blockchain verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
