
import React, { useState } from 'react';
import { getInitialAnalysis } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ValidatorPathProps {
  onIdeaReady: (idea: string, analysis: string) => void;
  onGoHome: () => void;
}

const ValidatorPath: React.FC<ValidatorPathProps> = ({ onIdeaReady, onGoHome }) => {
  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!idea.trim()) {
      setError('Please enter your idea.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await getInitialAnalysis(idea);
    if (result.startsWith("There was an error")) {
        setError(result);
    } else {
        setAnalysis(result);
    }
    setIsLoading(false);
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => (
        <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400">$1</strong>') }} />
    ));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="w-full flex justify-start mb-4">
        <button onClick={onGoHome} className="text-sm text-blue-400 hover:underline">
          &larr; Back to Home
        </button>
      </div>
      {!analysis ? (
        <>
          <h2 className="text-3xl font-bold text-center mb-2">Great, let's get started.</h2>
          <p className="text-gray-400 text-center mb-8">Briefly describe your startup idea below.</p>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., A subscription box for rare indoor plants."
              className="w-full h-32 bg-gray-900 border border-gray-600 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              disabled={isLoading}
            />
            {error && <p className="text-red-400 mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-600"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Analyze My Idea'}
            </button>
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-6">Initial Analysis</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 text-gray-300 space-y-4">
             {formatAnalysis(analysis)}
          </div>
          <button
            onClick={() => onIdeaReady(idea, analysis)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Let's Validate This Idea
          </button>
        </div>
      )}
    </div>
  );
};

export default ValidatorPath;
