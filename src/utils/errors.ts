// Parse Supabase errors to user-friendly messages
export const parseError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  // Supabase auth errors
  if (error.message) {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password';
      case 'Email not confirmed':
        return 'Please verify your email address';
      case 'User already registered':
        return 'An account with this email already exists';
      case 'Password recovery required':
        return 'Please reset your password';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Log error for debugging
export const logError = (error: any, context?: string): void => {
  console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
};
