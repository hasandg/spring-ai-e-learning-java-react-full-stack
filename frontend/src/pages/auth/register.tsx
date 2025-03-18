import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Form } from '@/components/common/Form';
import { FormField } from '@/components/common/FormField';
import { FormSelect } from '@/components/common/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { SelectChangeEvent } from '@mui/material';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string().required('Role is required'),
  department: Yup.string().required('Department is required'),
});

const initialValues: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  department: '',
};

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Administrator' },
];

const departmentOptions = [
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' },
  { value: 'arts', label: 'Arts' },
];

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values);
    } catch (error) {
      console.error('Registration failed:', error);
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
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('auth.register')}
        </Typography>
        <Form<RegisterFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitButtonText={t('auth.register')}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormField
                  name="firstName"
                  label={t('auth.firstName')}
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  touched={touched.firstName}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  name="lastName"
                  label={t('auth.lastName')}
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  touched={touched.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  name="email"
                  label={t('auth.email')}
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  name="confirmPassword"
                  label={t('auth.confirmPassword')}
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormSelect
                  name="role"
                  label={t('auth.role')}
                  value={values.role}
                  onChange={(e: SelectChangeEvent<unknown>) => {
                    setFieldValue('role', e.target.value);
                  }}
                  onBlur={handleBlur}
                  error={errors.role}
                  touched={touched.role}
                  options={roleOptions}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormSelect
                  name="department"
                  label={t('auth.department')}
                  value={values.department}
                  onChange={(e: SelectChangeEvent<unknown>) => {
                    setFieldValue('department', e.target.value);
                  }}
                  onBlur={handleBlur}
                  error={errors.department}
                  touched={touched.department}
                  options={departmentOptions}
                />
              </Grid>
            </Grid>
          )}
        </Form>
      </Paper>
    </Box>
  );
} 