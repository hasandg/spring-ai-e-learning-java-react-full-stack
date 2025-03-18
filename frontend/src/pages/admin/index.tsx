import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { withAuth } from '@/components/auth/withAuth';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('admin.title')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          {t('admin.welcomeMessage')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default withAuth(AdminPage, {
  roles: ['admin'],
  redirectTo: '/login',
}); 