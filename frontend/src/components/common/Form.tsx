import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useFormValidation } from '@/hooks/useFormValidation';
import * as Yup from 'yup';

interface FormProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children: (props: {
    values: T;
    errors: { [K in keyof T]?: string };
    touched: { [K in keyof T]?: boolean };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFieldValue: (field: keyof T, value: any) => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
  submitButtonText?: string;
  submitButtonProps?: React.ComponentProps<typeof Button>;
  containerProps?: React.ComponentProps<typeof Box>;
}

export const Form = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
  children,
  submitButtonText = 'Submit',
  submitButtonProps,
  containerProps,
}: FormProps<T>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = useFormValidation({
    initialValues,
    validationSchema,
    onSubmit,
    onSuccess,
    onError,
  });

  return (
    <Box component="form" onSubmit={handleSubmit} {...containerProps}>
      {children({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      })}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        {...submitButtonProps}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          submitButtonText
        )}
      </Button>
    </Box>
  );
}; 