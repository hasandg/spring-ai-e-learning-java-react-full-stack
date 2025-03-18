import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import PdfViewer from '@/components/common/PdfViewer';

export default function PdfViewerExample() {
  // Default PDF url from a public source
  const defaultPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  
  const [pdfUrl, setPdfUrl] = useState(defaultPdfUrl);
  const [inputUrl, setInputUrl] = useState(defaultPdfUrl);

  const handleLoadPdf = () => {
    setPdfUrl(inputUrl);
  };

  const handleReset = () => {
    setInputUrl(defaultPdfUrl);
    setPdfUrl(defaultPdfUrl);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        PDF Viewer Example
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Load a PDF
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="PDF URL"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL to a PDF file"
              helperText="Enter a URL to a publicly accessible PDF file"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadPdf}
              fullWidth
            >
              Load PDF
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              variant="outlined"
              onClick={handleReset}
              fullWidth
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <PdfViewer
        pdfUrl={pdfUrl}
        title="PDF Document Viewer"
        downloadable={true}
      />
    </Box>
  );
} 