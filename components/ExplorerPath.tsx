import React, { useState, useMemo } from 'react';
import { MARKETS } from '../constants';
import { Market, Opportunity, MarketNode } from '../types';
import { generateMarketTree } from '../services/geminiService';
import CashIcon from './icons/CashIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import PercentageIcon from './icons/PercentageIcon';
import LoadingSpinner from './LoadingSpinner';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


interface MarketNodeViewProps {
    node: MarketNode;
    level: number;
    onNodeSelect: (node: MarketNode) => void;
    selectedNode: MarketNode | null;
}

const MarketNodeView: React.FC<MarketNodeViewProps> = ({ node, level, onNodeSelect, selectedNode }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2);
    const isLeaf = !node.children || node.children.length === 0;
    const isSelected = selectedNode?.name === node.name;

    const handleToggle = () => {
        if (!isLeaf) {
            setIsExpanded(!isExpanded);
        }
        onNodeSelect(node);
    };
    
    return (
        <div style={{ paddingLeft: level > 0 ? '1.5rem' : '0' }} className="relative">
            {level > 0 && <div className="absolute left-0 top-0 w-px h-full bg-gray-700" style={{left: '0.5rem'}}></div>}
             <div 
                className={`flex items-center group cursor-pointer rounded-md transition-colors ${isSelected && isLeaf ? 'bg-blue-900/50' : 'hover:bg-gray-700/50'}`}
                onClick={handleToggle}
             >
                <div className="relative h-full flex items-center">
                    {level > 0 && <div className="absolute w-4 h-px bg-gray-700" style={{left: '-1rem', top: '50%'}}></div>}
                    {!isLeaf && (
                        <ChevronDownIcon className={`w-4 h-4 text-gray-500 mr-2 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                    )}
                    {isLeaf && <div className="w-4 h-4 mr-2 flex-shrink-0"></div>}
                </div>

                <div className="flex-grow flex items-center justify-between p-2">
                    <span className="text-gray-200">{node.name}</span>
                    <div className="flex items-center text-sm font-medium bg-gray-900/50 border border-gray-600 rounded-full px-3 py-1">
                        <PercentageIcon className="w-4 h-4 mr-1.5 text-green-400" />
                        <span className="text-gray-300">{node.probability}%</span>
                    </div>
                </div>
            </div>

            {isExpanded && node.children && (
                <div className="mt-1">
                    {node.children.map(child => (
                        <MarketNodeView key={child.name} node={child} level={level + 1} onNodeSelect={onNodeSelect} selectedNode={selectedNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Fix: Define props interface for ExplorerPath component.
interface ExplorerPathProps {
    onProblemReady: (opportunity: Opportunity) => void;
    onGoHome: () => void;
}

const ExplorerPath: React.FC<ExplorerPathProps> = ({ onProblemReady, onGoHome }) => {
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
    const [marketTree, setMarketTree] = useState<MarketNode | null>(null);
    const [isTreeLoading, setIsTreeLoading] = useState(false);
    const [treeError, setTreeError] = useState('');
    const [selectedNode, setSelectedNode] = useState<MarketNode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectMarket = async (market: Market) => {
        setSelectedMarket(market);
        setIsTreeLoading(true);
        setMarketTree(null);
        setTreeError('');
        setSelectedNode(null);

        const tree = await generateMarketTree(market.name);
        if (tree) {
            setMarketTree(tree);
        } else {
            setTreeError('Failed to generate market analysis. Please check your API key and try again.');
        }
        setIsTreeLoading(false);
    };

    const handleBackToMarkets = () => {
        setSelectedMarket(null);
        setMarketTree(null);
        setSelectedNode(null);
        setSearchQuery('');
    };
    
    const handleNodeSelect = (node: MarketNode) => {
        if (!node.children || node.children.length === 0) {
            setSelectedNode(node);
        }
    };
    
    const handleTackleProblem = () => {
        if (selectedNode) {
            const opportunity: Opportunity = {
                title: selectedNode.name,
                details: selectedNode.details || 'No specific details generated for this idea.',
                existingSolutions: [], // Not generated by the tree analysis
            };
            onProblemReady(opportunity);
        }
    };

    const filteredMarkets = useMemo(() => {
        if (!searchQuery.trim()) return MARKETS;
        return MARKETS.filter(market =>
            market.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="w-full animate-fade-in">
            <nav className="w-full flex justify-start items-center mb-4">
                <button onClick={onGoHome} className="text-sm text-blue-400 hover:underline">
                    &larr; Home
                </button>
                {selectedMarket && (
                    <>
                        <span className="text-gray-500 mx-2">/</span>
                        <button onClick={handleBackToMarkets} className="text-sm text-blue-400 hover:underline">
                            Markets
                        </button>
                    </>
                )}
            </nav>

            {!selectedMarket ? (
                <>
                    <h2 className="text-3xl font-bold text-center mb-2">Market Explorer</h2>
                    <p className="text-gray-400 text-center mb-8">Explore promising markets to uncover high-potential business ideas.</p>
                    <div className="relative mb-8 max-w-lg mx-auto">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search markets..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredMarkets.map((market) => (
                            <button
                                key={market.name}
                                onClick={() => handleSelectMarket(market)}
                                className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <h3 className="text-xl font-bold text-white mb-3">{market.name}</h3>
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <CashIcon className="w-5 h-5 mr-2 text-green-400" />
                                        <span>Current Size: <strong className="text-gray-200">{market.currentSize}</strong></span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <TrendingUpIcon className="w-5 h-5 mr-2 text-blue-400" />
                                        <span>Future Evaluation: <strong className="text-gray-200">{market.futureEvaluation}</strong></span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    {filteredMarkets.length === 0 && (
                        <p className="text-gray-500 text-center mt-8">No markets found for "{searchQuery}"</p>
                    )}
                </>
            ) : (
                <div>
                    <h2 className="text-3xl font-bold mb-1">Market Potential Analysis</h2>
                    <p className="text-gray-400 mb-6">Generated for: <strong className="text-gray-200">{selectedMarket.name}</strong></p>

                    {isTreeLoading && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-10 text-center">
                            <LoadingSpinner />
                            <p className="text-gray-400 mt-4">Analyzing market potential with AI...</p>
                        </div>
                    )}
                    {treeError && <p className="text-red-400 text-center">{treeError}</p>}
                    
                    {marketTree && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
                               <MarketNodeView node={marketTree} level={0} onNodeSelect={handleNodeSelect} selectedNode={selectedNode} />
                            </div>
                            <div className="md:col-span-1">
                                {!selectedNode && (
                                    <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-6 text-center h-full flex flex-col justify-center">
                                        <p className="text-gray-500">Select a leaf node (a specific idea) from the tree to see details and proceed.</p>
                                    </div>
                                )}
                                {selectedNode && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in sticky top-4">
                                        <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                                        <p className="text-sm text-gray-400 mt-2 mb-4">{selectedNode.details}</p>
                                        <button
                                          onClick={handleTackleProblem}
                                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                        >
                                          Tackle This Problem
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExplorerPath;