import { ChartOptions } from 'chart.js';
import 'chart.js/auto';

export interface ChartColors {
  primary: string[];
  secondary: string[];
  success: string[];
  error: string[];
  warning: string[];
  info: string[];
}

export const chartColors: ChartColors = {
  primary: ['#1976d2', '#42a5f5', '#90caf9'],
  secondary: ['#9c27b0', '#ba68c8', '#e1bee7'],
  success: ['#2e7d32', '#66bb6a', '#a5d6a7'],
  error: ['#d32f2f', '#ef5350', '#ef9a9a'],
  warning: ['#ed6c02', '#ffa726', '#ffb74d'],
  info: ['#0288d1', '#29b6f6', '#81d4fa'],
};

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle' as const,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyColor: '#fff',
      bodyFont: {
        size: 13,
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },
  },
};

export const lineChartOptions: ChartOptions<'line'> = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        padding: 10,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        padding: 10,
      },
    },
  },
};

export const barChartOptions: ChartOptions<'bar'> = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        padding: 10,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        padding: 10,
      },
      beginAtZero: true,
    },
  },
};

export const pieChartOptions: ChartOptions<'pie'> = {
  ...baseChartOptions,
};

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      ...baseChartOptions.plugins.legend,
      position: 'center' as const,
    },
  },
};

export interface D3Config {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  transition: {
    duration: number;
  };
  color: {
    scheme: string;
    range: string[];
  };
}

export const d3Config: D3Config = {
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  },
  transition: {
    duration: 750,
  },
  color: {
    scheme: 'schemeCategory10',
    range: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
  },
}; 