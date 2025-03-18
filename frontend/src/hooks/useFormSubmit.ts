import { useState } from 'react';

interface UseFormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  resetForm?: () => void;
}

interface UseFormSubmitResult {
  loading: boolean;
  error: Error | null;
  submit: (data: any) => Promise<void>;
  reset: () => void;
}

export const useFormSubmit = <T>({
  onSubmit,
  onSuccess,
  onError,
  resetForm,
}: UseFormSubmitOptions<T>): UseFormSubmitResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (data: T) => {
    try {
      setLoading(true);
      setError(null);
      await onSubmit(data);
      onSuccess?.();
      resetForm?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    resetForm?.();
  };

  return {
    loading,
    error,
    submit,
    reset,
  };
}; 