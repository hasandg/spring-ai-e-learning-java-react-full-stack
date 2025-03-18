import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Box, Paper, Typography, CircularProgress, useTheme } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Title,
  Filler
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

interface ChartWrapperProps {
  type: ChartType;
  data: ChartData<any>;
  options?: ChartOptions<any>;
  title?: string;
  height?: number;
  width?: number;
  loading?: boolean;
}

const ChartWrapper = ({
  type,
  data,
  options,
  title,
  height = 300,
  width,
  loading = false,
}: ChartWrapperProps) => {
  const theme = useTheme();
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<any>>(data);

  // Apply theme colors to chart data if not already provided
  useEffect(() => {
    const defaultColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ];

    if (data.datasets) {
      const updatedDatasets = data.datasets.map((dataset, index) => {
        // If the dataset doesn't have a backgroundColor, assign one from our theme colors
        if (!dataset.backgroundColor && ['pie', 'doughnut', 'polarArea'].includes(type)) {
          // For pie/doughnut charts, create an array of colors
          return {
            ...dataset,
            backgroundColor: data.labels?.map((_, i) => defaultColors[i % defaultColors.length]),
            borderColor: data.labels?.map((_, i) => defaultColors[i % defaultColors.length]),
          };
        } else if (!dataset.backgroundColor) {
          // For other chart types, use a single color
          return {
            ...dataset,
            backgroundColor: defaultColors[index % defaultColors.length],
            borderColor: defaultColors[index % defaultColors.length],
          };
        }
        return dataset;
      });

      setChartData({
        ...data,
        datasets: updatedDatasets,
      });
    }
  }, [data, type, theme.palette]);

  // Default options based on chart type
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          // Convert to RGB for opacity
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      title: {
        display: !!title,
        text: title || '',
        color: theme.palette.text.primary,
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        titleFont: {
          family: theme.typography.fontFamily,
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        },
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' && type !== 'radar'
      ? {
          x: {
            grid: {
              color: theme.palette.divider,
            },
            ticks: {
              color: theme.palette.text.secondary,
            },
            border: {
              color: theme.palette.divider,
            },
          },
          y: {
            grid: {
              color: theme.palette.divider,
            },
            ticks: {
              color: theme.palette.text.secondary,
            },
            border: {
              color: theme.palette.divider,
            },
          },
        }
      : undefined,
  };

  // Merge default options with user-provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: width || '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height,
          width: '100%',
          position: 'relative',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Chart
          ref={chartRef}
          type={type}
          data={chartData}
          options={mergedOptions}
        />
      </Box>
    </Paper>
  );
};

export default ChartWrapper; 