
import { Market } from './types';

export const MARKETS: Market[] = [
  {
    name: 'AI for Small Businesses',
    currentSize: '$38B',
    futureEvaluation: '$150B (5-Year Projection)',
    opportunities: [
      {
        title: 'Local restaurants struggle to run effective social media ad campaigns.',
        details: 'High cost of agencies and complexity of ad platforms create a barrier for small restaurant owners to effectively market on social media.',
        existingSolutions: ['Hiring a marketing agency', 'DIY with Facebook Ads Manager', 'Generic social media scheduling tools'],
      },
      {
        title: 'Independent retail shops need better inventory management.',
        details: 'Small shops often rely on manual tracking or basic spreadsheets, leading to stockouts of popular items and overstocking of others.',
        existingSolutions: ['Manual spreadsheets', 'Complex POS systems with inventory modules', 'General accounting software'],
      },
    ],
  },
  {
    name: 'The Creator Economy',
    currentSize: '$104B',
    futureEvaluation: '$225B (5-Year Projection)',
    opportunities: [
      {
        title: 'Emerging creators find it hard to secure brand sponsorships.',
        details: 'Brands prefer established creators, and new creators lack the tools and network to find and negotiate fair deals.',
        existingSolutions: ['Cold emailing brands', 'Influencer marketing platforms (high fees)', 'Relying on ad revenue'],
      },
      {
        title: 'Content creators burn out from managing multiple platforms.',
        details: 'Juggling content creation, scheduling, and community management across TikTok, YouTube, Instagram, and more is unsustainable for individuals.',
        existingSolutions: ['Hiring a social media manager', 'Using multiple separate scheduling tools', 'Manual posting'],
      },
    ],
  },
  {
    name: 'Sustainable Packaging',
    currentSize: '$290B',
    futureEvaluation: '$450B (5-Year Projection)',
    opportunities: [
      {
        title: 'E-commerce businesses want eco-friendly shipping options that are affordable.',
        details: 'Sustainable packaging materials are often significantly more expensive than traditional plastic-based options, making them inaccessible for small businesses.',
        existingSolutions: ['Standard bubble mailers', 'Recycled cardboard boxes (often still with plastic tape)', 'Expensive compostable mailers'],
      },
      {
        title: 'Consumers are confused about how to properly recycle packaging.',
        details: 'Complex local recycling rules and mixed-material packaging lead to low recycling rates and high contamination.',
        existingSolutions: ['Generic recycling symbols (often misleading)', 'Local council websites', 'Trial and error'],
      },
    ],
  },
];