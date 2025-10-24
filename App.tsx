
import React, { useState, useCallback } from 'react';
import { Stage, Opportunity } from './types';
import WelcomeStage from './components/WelcomeStage';
import ValidatorPath from './components/ValidatorPath';
import ExplorerPath from './components/ExplorerPath';
import AuthModal from './components/AuthModal';
import Workspace from './components/Workspace';

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>(Stage.Welcome);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [validationContext, setValidationContext] = useState<string>('');
  const [initialAnalysis, setInitialAnalysis] = useState<string>('');

  const handleSelectPath = useCallback((path: 'validator' | 'explorer') => {
    if (path === 'validator') {
      setStage(Stage.ValidatorPath);
    } else {
      setStage(Stage.ExplorerPath);
    }
  }, []);

  const handleIdeaReady = useCallback((idea: string, analysis: string) => {
    setValidationContext(`Validating the idea: "${idea}"`);
    setInitialAnalysis(analysis);
    setShowAuthModal(true);
  }, []);

  const handleProblemReady = useCallback((opportunity: Opportunity) => {
    setValidationContext(`Tackling the problem: "${opportunity.title}"`);
    setInitialAnalysis(`Problem details: ${opportunity.details}`);
    setShowAuthModal(true);
  }, []);
  
  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    setStage(Stage.Workspace);
  }, []);

  const handleGoHome = useCallback(() => {
    setStage(Stage.Welcome);
    setValidationContext('');
    setInitialAnalysis('');
  }, []);

  const renderStage = () => {
    switch (stage) {
      case Stage.Welcome:
        return <WelcomeStage onSelectPath={handleSelectPath} />;
      case Stage.ValidatorPath:
        return <ValidatorPath onIdeaReady={handleIdeaReady} onGoHome={handleGoHome} />;
      case Stage.ExplorerPath:
        return <ExplorerPath onProblemReady={handleProblemReady} onGoHome={handleGoHome} />;
      case Stage.Workspace:
        return <Workspace context={validationContext} initialAnalysis={initialAnalysis} onGoHome={handleGoHome} />;
      default:
        return <WelcomeStage onSelectPath={handleSelectPath} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        {renderStage()}
      </div>
      {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
};

export default App;
