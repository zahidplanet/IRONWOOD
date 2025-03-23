// This file handles API requests to fetch available AI agents
// from the ai-hedge-fund system

export default async function handler(req, res) {
  try {
    // In a production environment, this would actually call to the Python backend
    // For example, using a child_process to execute the Python script, or an API call
    // if the Python backend is running as a separate service
    
    // For demonstration, we'll return mock data
    const agents = [
      {
        id: 'warren_buffett',
        name: 'Warren Buffett',
        description: 'The oracle of Omaha, seeks wonderful companies at a fair price',
        status: 'active'
      },
      {
        id: 'cathie_wood',
        name: 'Cathie Wood',
        description: 'The queen of growth investing, believes in the power of innovation and disruption',
        status: 'active'
      },
      {
        id: 'charlie_munger',
        name: 'Charlie Munger',
        description: "Warren Buffett's partner, only buys wonderful businesses at fair prices",
        status: 'active'
      },
      {
        id: 'bill_ackman',
        name: 'Bill Ackman',
        description: 'An activist investor, takes bold positions and pushes for change',
        status: 'active'
      },
      {
        id: 'ben_graham',
        name: 'Ben Graham',
        description: 'The godfather of value investing, only buys hidden gems with a margin of safety',
        status: 'active'
      },
      {
        id: 'phil_fisher',
        name: 'Phil Fisher',
        description: 'Legendary growth investor who mastered scuttlebutt analysis',
        status: 'active'
      },
      {
        id: 'stanley_druckenmiller',
        name: 'Stanley Druckenmiller',
        description: 'Macro legend who hunts for asymmetric opportunities with growth potential',
        status: 'active'
      },
      {
        id: 'valuation',
        name: 'Valuation Agent',
        description: 'Calculates the intrinsic value of a stock and generates trading signals',
        status: 'active'
      },
      {
        id: 'sentiment',
        name: 'Sentiment Agent',
        description: 'Analyzes market sentiment and generates trading signals',
        status: 'active'
      },
      {
        id: 'fundamentals',
        name: 'Fundamentals Agent',
        description: 'Analyzes fundamental data and generates trading signals',
        status: 'active'
      },
      {
        id: 'technicals',
        name: 'Technical Agent',
        description: 'Analyzes technical indicators and generates trading signals',
        status: 'active'
      },
      {
        id: 'risk_manager',
        name: 'Risk Manager',
        description: 'Calculates risk metrics and sets position limits',
        status: 'active'
      },
      {
        id: 'portfolio_manager',
        name: 'Portfolio Manager',
        description: 'Makes final trading decisions and generates orders',
        status: 'active'
      }
    ];
    
    res.status(200).json({ agents });
  } catch (error) {
    console.error('Error fetching AI agents:', error);
    res.status(500).json({ error: 'Failed to fetch AI agents' });
  }
} 