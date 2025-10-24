
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import LightbulbIcon from './icons/LightbulbIcon';

interface WelcomeStageProps {
  onSelectPath: (path: 'validator' | 'explorer') => void;
}

const WelcomeStage: React.FC<WelcomeStageProps> = ({ onSelectPath }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        Validate Your Startup Idea
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
        De-risk your next venture. Whether you have a spark of an idea or are searching for the next big thing, we'll help you build a solid foundation.
      </p>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={() => onSelectPath('validator')}
          className="group flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-8 text-left transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-400 mr-4" />
            <h2 className="text-2xl font-semibold text-white">I have an idea to validate</h2>
          </div>
          <p className="text-gray-400">
            You've got the spark. Let's stress-test your concept, analyze the market, and refine your vision together.
          </p>
        </button>
        <button
          onClick={() => onSelectPath('explorer')}
          className="group flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-8 text-left transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-4">
            <LightbulbIcon className="w-8 h-8 text-blue-400 mr-4" />
            <h2 className="text-2xl font-semibold text-white">Help me find an idea</h2>
          </div>
          <p className="text-gray-400">
            Explore curated markets and validated problems. Discover an opportunity that excites you and is worth solving.
          </p>
        </button>
      </div>
    </div>
  );
};

export default WelcomeStage;
