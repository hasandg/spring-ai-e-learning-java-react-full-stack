import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Example components
import ExamplesIndex from '../pages/examples';
import PdfViewerExample from '../examples/PdfViewerExample';
import ChartsExample from '../examples/ChartsExample';
import DragAndDropExample from '../examples/DragAndDropExample';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Example routes */}
      <Route path="/examples" element={<ExamplesIndex />} />
      <Route path="/examples/pdf-viewer" element={<PdfViewerExample />} />
      <Route path="/examples/charts" element={<ChartsExample />} />
      <Route path="/examples/drag-and-drop" element={<DragAndDropExample />} />
    </Routes>
  );
};

export default AppRoutes; 