import { SnackbarOrigin, SnackbarProps } from '@mui/material';

// Notification (Snackbar) Configuration
export const snackbarConfig: Partial<SnackbarProps> & { origin: SnackbarOrigin } = {
  autoHideDuration: 3000,
  origin: {
    vertical: 'top',
    horizontal: 'right',
  },
};

// DataGrid Configuration
export const dataGridConfig = {
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  checkboxSelection: false,
  disableSelectionOnClick: true,
};

// Date Picker Configuration
export const datePickerConfig = {
  format: 'dd/MM/yyyy',
  mask: '__/__/____',
};

// Document Viewer Configuration
export const documentViewerConfig = {
  width: '100%',
  height: '800px',
  documentServerUrl: process.env.NEXT_PUBLIC_DOCUMENT_SERVER_URL,
};

// Video Player Configuration
export const videoPlayerConfig = {
  width: '100%',
  height: 'auto',
  controls: true,
  playing: false,
  muted: false,
  pip: true,
};

// Scrollbar Configuration
export const scrollbarConfig = {
  autoHide: true,
  autoHideTimeout: 1000,
  autoHideDuration: 200,
}; 