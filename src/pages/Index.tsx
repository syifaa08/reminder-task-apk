
import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import OnboardingScreens from '@/components/OnboardingScreens';
import MainApp from '@/components/MainApp';

type AppState = 'splash' | 'onboarding' | 'main';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Cek apakah user sudah pernah onboarding
    const savedUserName = localStorage.getItem('taskReminderUserName');
    const hasCompletedOnboarding = localStorage.getItem('taskReminderOnboardingComplete');
    
    if (hasCompletedOnboarding && savedUserName) {
      setUserName(savedUserName);
      // Tetap tampilkan splash screen dulu, lalu langsung ke main app
    }
  }, []);

  const handleSplashComplete = () => {
    const hasCompletedOnboarding = localStorage.getItem('taskReminderOnboardingComplete');
    if (hasCompletedOnboarding) {
      setAppState('main');
    } else {
      setAppState('onboarding');
    }
  };

  const handleOnboardingComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem('taskReminderUserName', name);
    localStorage.setItem('taskReminderOnboardingComplete', 'true');
    setAppState('main');
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingScreens onComplete={handleOnboardingComplete} />;
  }

  return <MainApp userName={userName} />;
};

export default Index;
