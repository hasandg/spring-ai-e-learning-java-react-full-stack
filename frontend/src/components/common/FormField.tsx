import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  SelectChangeEvent,
} from '@mui/material';

interface FormFieldProps {
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  type?: string;
  fullWidth?: boolean;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  minRows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  label,
  type = 'text',
  fullWidth = true,
  required = false,
  helperText,
  ...props
}) => {
  const showError = touched && !!error;

  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      label={label}
      type={type}
      fullWidth={fullWidth}
      required={required}
      error={showError}
      helperText={showError ? error : helperText}
      {...props}
    />
  );
};

interface FormSelectProps {
  name: string;
  value: any;
  onChange: (e: SelectChangeEvent<unknown>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  options: Array<{ value: any; label: string }>;
  fullWidth?: boolean;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  label,
  options,
  fullWidth = true,
  required = false,
  helperText,
  ...props
}) => {
  const showError = touched && !!error;

  return (
    <FormControl fullWidth={fullWidth} error={showError}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(showError || helperText) && (
        <FormHelperText>{showError ? error : helperText}</FormHelperText>
      )}
    </FormControl>
  );
}; 