import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layout/MainLayout';
import { lineChartOptions, chartColors } from '@/config/charts';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalCourses'),
      value: '12',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: t('dashboard.pendingAssignments'),
      value: '5',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
    },
    {
      title: t('dashboard.upcomingEvents'),
      value: '3',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
    },
    {
      title: t('dashboard.progress'),
      value: '75%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
  ];

  const progressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: t('dashboard.learningProgress'),
        data: [65, 70, 75, 72, 78, 75],
        borderColor: chartColors.primary[0],
        backgroundColor: chartColors.primary[1],
        tension: 0.4,
      },
    ],
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('navigation.dashboard')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('dashboard.welcomeMessage')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: 1,
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { color: stat.color },
                    })}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseInt(stat.value)}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: `${stat.color}15`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.learningProgress')}
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={progressData} options={lineChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default DashboardPage; 