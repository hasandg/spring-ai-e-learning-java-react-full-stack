import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Paper, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  initialPage?: number;
  downloadable?: boolean;
  fileName?: string;
}

const PdfViewer = ({
  pdfUrl,
  title,
  initialPage = 1,
  downloadable = true,
  fileName,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    setLoadError(error);
    setIsLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber >= (numPages || 1) ? (numPages || 1) : pageNumber + 1);
  };

  const zoomIn = () => {
    setScale((prevScale: number) => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prevScale: number) => Math.max(prevScale - 0.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName || pdfUrl.split('/').pop() || 'document.pdf';
    link.target = '_blank';
    link.click();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, width: '100%', overflow: 'hidden' }}>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1} aria-label="Previous page">
          <NavigateBeforeIcon />
        </IconButton>
        {numPages && (
          <Typography variant="body1" sx={{ alignSelf: 'center', mx: 2 }}>
            Page {pageNumber} of {numPages}
          </Typography>
        )}
        <IconButton onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} aria-label="Next page">
          <NavigateNextIcon />
        </IconButton>

        <Box sx={{ mx: 2 }}>
          <IconButton onClick={zoomOut} aria-label="Zoom out">
            <ZoomOutIcon />
          </IconButton>
          <Typography variant="body2" sx={{ display: 'inline-block', mx: 1 }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton onClick={zoomIn} aria-label="Zoom in">
            <ZoomInIcon />
          </IconButton>
        </Box>

        {downloadable && (
          <IconButton onClick={handleDownload} aria-label="Download PDF">
            <DownloadIcon />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto',
          maxHeight: '80vh',
          width: '100%',
        }}
      >
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {loadError && (
          <Box sx={{ p: 3, color: 'error.main' }}>
            <Typography variant="h6">Error loading PDF</Typography>
            <Typography variant="body2">{loadError.message}</Typography>
          </Box>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<CircularProgress />}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </Box>
    </Paper>
  );
};

export default PdfViewer; 