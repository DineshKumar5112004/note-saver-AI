import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import AppRoutes from '@/routes/AppRoutes';

console.log('App.tsx is loading...');

const App: React.FC = () => {
  console.log('App version: 1.0.1 (Local Storage Mode)');
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
