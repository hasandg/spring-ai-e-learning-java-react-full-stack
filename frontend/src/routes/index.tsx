import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Example components
import ExamplesIndex from '../pages/examples';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Example routes */}
      <Route path="/examples" element={<ExamplesIndex />} />
    </Routes>
  );
};

export default AppRoutes; 