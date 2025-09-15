import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MainPage } from './MainPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PasswordScreen } from './components/PasswordScreen';
import { FaqPage } from './components/HelpPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';

function AppContent() {
  const { user, signIn } = useAuth();
  const [view, setView] = useState<'main' | 'faq' | 'terms'>('main');

  const handleLoginSuccess = () => {
    // Logs in an anonymous user and stores the session
    signIn();
  };
  
  const showFaqPage = () => setView('faq');
  const showMainPage = () => setView('main');
  const showTermsPage = () => setView('terms');

  // If a user exists (from session or after login), show the main or help page
  if (user) {
    if (view === 'faq') {
        return <FaqPage onGoBack={showMainPage} />;
    }
    return <MainPage onShowFaq={showFaqPage} />;
  }
  
  // Otherwise, show the password screen or terms page
  if (view === 'terms') {
      return <TermsAndConditionsPage onGoBack={() => setView('main')} />;
  }
  
  return <PasswordScreen onLoginSuccess={handleLoginSuccess} onShowTerms={showTermsPage} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}