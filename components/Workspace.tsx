
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MessageSender } from '../types';
import { continueConversation, generateValidationDocument } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';

interface WorkspaceProps {
  context: string;
  initialAnalysis: string;
  onGoHome: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ context, initialAnalysis, onGoHome }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDocGenerating, setIsDocGenerating] = useState(false);
  const [validationDoc, setValidationDoc] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      { sender: MessageSender.AI, text: `Okay, let's start building your concept for: *${context.replace('Validating the idea: ', '').replace('Tackling the problem: ', '')}*`},
      { sender: MessageSender.AI, text: "Let's start building your solution. What are your initial thoughts on how to approach this?"}
    ];
    setChatHistory(initialMessages);
  }, [context]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { sender: MessageSender.User, text: userInput };
    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    const aiResponseText = await continueConversation(newHistory, userInput);
    
    const newAiMessage: ChatMessage = { sender: MessageSender.AI, text: aiResponseText };
    setChatHistory(prevHistory => [...prevHistory, newAiMessage]);
    setIsLoading(false);
  };
  
  const handleGenerateDocument = async () => {
    setIsDocGenerating(true);
    const doc = await generateValidationDocument(chatHistory);
    setValidationDoc(doc);
    setIsDocGenerating(false);
  }

  const formatMessage = (text: string) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };
  
  if (validationDoc) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setValidationDoc('')} className="text-sm text-blue-400 hover:underline">
                  &larr; Back to Workspace
              </button>
              <button onClick={onGoHome} className="text-sm text-blue-400 hover:underline">
                  Exit to Home &rarr;
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Validation Document</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 prose prose-invert prose-strong:text-blue-400 max-w-none">
                 {formatMessage(validationDoc.replace(/\n/g, '<br />'))}
            </div>
        </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col h-[90vh] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-gray-200">AI Co-founder Workspace</h2>
        <button onClick={onGoHome} className="text-sm text-blue-400 hover:underline">
            Exit to Home &rarr;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === MessageSender.User ? 'justify-end' : ''}`}>
            {msg.sender === MessageSender.AI && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-xl rounded-lg px-4 py-2 ${msg.sender === MessageSender.User ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-300 rounded-bl-none'}`}>
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-700 rounded-lg px-4 py-3 flex items-center">
                    <LoadingSpinner />
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        {chatHistory.length > 4 && (
             <button
              onClick={handleGenerateDocument}
              disabled={isDocGenerating}
              className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-600"
            >
              {isDocGenerating ? <LoadingSpinner /> : 'Generate Validation Document'}
            </button>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Your response..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition-colors disabled:bg-gray-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
