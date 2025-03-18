import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ChartWrapper from '@/components/charts/ChartWrapper';
import { ChartData } from 'chart.js';

export default function ChartsExample() {
  // Sample data for charts
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  // Line chart data
  const lineChartData: ChartData<'line'> = {
    labels: months,
    datasets: [
      {
        label: 'Course Completion',
        data: [65, 59, 80, 81, 56, 55, 72],
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Quiz Scores',
        data: [28, 48, 40, 65, 59, 80, 95],
        fill: false,
        tension: 0.1,
      },
    ],
  };
  
  // Bar chart data
  const barChartData: ChartData<'bar'> = {
    labels: months,
    datasets: [
      {
        label: 'Assignments Completed',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderWidth: 1,
      },
      {
        label: 'Hours Spent Learning',
        data: [8, 15, 7, 12, 9, 12, 17],
        borderWidth: 1,
      },
    ],
  };
  
  // Pie chart data
  const pieChartData: ChartData<'pie'> = {
    labels: ['Videos', 'Quizzes', 'Readings', 'Assignments', 'Discussion'],
    datasets: [
      {
        label: 'Time Distribution',
        data: [35, 20, 15, 25, 5],
        borderWidth: 1,
      },
    ],
  };
  
  // Radar chart data
  const radarChartData: ChartData<'radar'> = {
    labels: ['Participation', 'Assignments', 'Quizzes', 'Projects', 'Final Exam', 'Attendance'],
    datasets: [
      {
        label: 'Student Performance',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
      },
      {
        label: 'Class Average',
        data: [50, 60, 70, 80, 60, 75],
        fill: true,
      },
    ],
  };
  
  // Chart selection state
  const [selectedChart, setSelectedChart] = useState<string>('all');
  
  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: string,
  ) => {
    if (newChartType !== null) {
      setSelectedChart(newChartType);
    }
  };
  
  // Determine which charts to show based on selection
  const showLineChart = selectedChart === 'all' || selectedChart === 'line';
  const showBarChart = selectedChart === 'all' || selectedChart === 'bar';
  const showPieChart = selectedChart === 'all' || selectedChart === 'pie';
  const showRadarChart = selectedChart === 'all' || selectedChart === 'radar';
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Charts Example
      </Typography>
      
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Chart Type
        </Typography>
        <ToggleButtonGroup
          value={selectedChart}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all" aria-label="all charts">
            All Charts
          </ToggleButton>
          <ToggleButton value="line" aria-label="line chart">
            Line
          </ToggleButton>
          <ToggleButton value="bar" aria-label="bar chart">
            Bar
          </ToggleButton>
          <ToggleButton value="pie" aria-label="pie chart">
            Pie
          </ToggleButton>
          <ToggleButton value="radar" aria-label="radar chart">
            Radar
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      
      <Grid container spacing={3}>
        {showLineChart && (
          <Grid item xs={12} md={6}>
            <ChartWrapper
              type="line"
              data={lineChartData}
              title="Student Progress Over Time"
              height={300}
            />
          </Grid>
        )}
        
        {showBarChart && (
          <Grid item xs={12} md={6}>
            <ChartWrapper
              type="bar"
              data={barChartData}
              title="Learning Activity"
              height={300}
            />
          </Grid>
        )}
        
        {showPieChart && (
          <Grid item xs={12} md={6}>
            <ChartWrapper
              type="pie"
              data={pieChartData}
              title="Learning Content Distribution"
              height={300}
            />
          </Grid>
        )}
        
        {showRadarChart && (
          <Grid item xs={12} md={6}>
            <ChartWrapper
              type="radar"
              data={radarChartData}
              title="Skills Assessment"
              height={300}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 