import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Form } from '@/components/common/Form';
import { FormField } from '@/components/common/FormField';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('auth.login')}
        </Typography>
        <Form<LoginFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitButtonText={t('auth.login')}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <>
              <FormField
                name="email"
                label={t('auth.email')}
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                autoFocus
              />
              <FormField
                name="password"
                label={t('auth.password')}
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
              />
            </>
          )}
        </Form>
      </Paper>
    </Box>
  );
} 