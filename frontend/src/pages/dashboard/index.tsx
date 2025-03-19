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
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layout/MainLayout';

const DashboardPage = () => {
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
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Courses in Progress</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={65}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            flexGrow: 1,
                            mr: 2,
                            backgroundColor: `${theme.palette.primary.main}15`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                        <Typography variant="body2">65%</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Assignments Completed</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={42}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            flexGrow: 1,
                            mr: 2,
                            backgroundColor: `${theme.palette.success.main}15`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.success.main,
                            },
                          }}
                        />
                        <Typography variant="body2">42%</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Quiz Scores</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={78}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            flexGrow: 1,
                            mr: 2,
                            backgroundColor: `${theme.palette.info.main}15`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.info.main,
                            },
                          }}
                        />
                        <Typography variant="body2">78%</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default DashboardPage; 