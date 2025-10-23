import React from 'react';
import { Component as AILoader } from './ui/ai-loader';
import { BackgroundNoiseWrapper } from './ui/background-noise-effect';

interface LoadingScreenProps {
  progress: number;
  statusText: string;
  theme?: 'light' | 'dark';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, statusText, theme = 'light' }) => {
  return (
    <BackgroundNoiseWrapper variant={theme as 'light' | 'dark'} className="h-screen w-full">
      <div className="flex items-center justify-center h-screen w-full">
        <AILoader text={statusText} size={150} />
      </div>
    </BackgroundNoiseWrapper>
  );
};

export default LoadingScreen;