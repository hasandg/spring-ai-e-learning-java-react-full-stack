import { Theme } from '@mui/material/styles';

export interface LayoutConfig {
  drawerWidth: number;
  headerHeight: number;
  footerHeight: number;
  contentPadding: number;
  maxContentWidth: number;
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  zIndex: {
    drawer: number;
    appBar: number;
    modal: number;
    snackbar: number;
    tooltip: number;
  };
}

export const layoutConfig: LayoutConfig = {
  drawerWidth: 240,
  headerHeight: 64,
  footerHeight: 48,
  contentPadding: 24,
  maxContentWidth: 1200,
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  zIndex: {
    drawer: 1200,
    appBar: 1100,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export const getResponsiveSpacing = (theme: Theme, size: keyof LayoutConfig['spacing']): number => {
  return theme.spacing(layoutConfig.spacing[size] / 8);
};

export const getResponsiveValue = <T>(
  theme: Theme,
  values: Partial<Record<keyof LayoutConfig['breakpoints'], T>>,
  defaultValue: T
): T => {
  const breakpoints = Object.entries(layoutConfig.breakpoints)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as keyof LayoutConfig['breakpoints']);

  for (const breakpoint of breakpoints) {
    if (theme.breakpoints.up(breakpoint) && values[breakpoint]) {
      return values[breakpoint] as T;
    }
  }

  return defaultValue;
}; 