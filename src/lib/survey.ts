export interface SurveyAnswers {
  primaryGoal?: string;
  tradingExperience?: string;
  codingComfort?: string;
  mentorshipPreference?: string;
  currentTools?: string;
}

export interface ProductScore {
  name: string;
  points: number;
  percentage: number;
  explanation: string;
}

export const PRODUCTS = {
  'Trader Journal': {
    name: 'Trader Journal',
    url: 'https://investopedia.com',
    description: 'Keeping a detailed trade log helps traders spot emotional decisions and learn from mistakes'
  },
  'ZipLime': {
    name: 'ZipLime',
    url: 'https://ziplime.limex.com',
    description: 'AI converts natural-language strategies into code and backtests them'
  },
  'Alpha Builder': {
    name: 'Alpha Builder',
    url: 'https://builder.limex.com',
    description: 'Creates strategies based on risk/reward preferences and rebalances automatically'
  },
  'Copilot': {
    name: 'Copilot',
    url: 'https://limex.com',
    description: 'Lets users follow verified experts and see their reasoning'
  },
  'Quantum': {
    name: 'Quantum',
    url: 'https://promo.limex.com',
    description: 'Offers internships and performance-based compensation to aspiring quants'
  },
  'Quantum Course': {
    name: 'Quantum Course',
    url: 'https://promo.limex.com',
    description: 'Teaches algorithmic trading with proven methodologies'
  }
};

export function calculateProductScores(answers: SurveyAnswers): ProductScore[] {
  const scores: { [key: string]: number } = {
    'Trader Journal': 0,
    'ZipLime': 0,
    'Alpha Builder': 0,
    'Copilot': 0,
    'Quantum': 0,
    'Quantum Course': 0
  };

  // Question 1: Primary Goal (50 points total)
  switch (answers.primaryGoal) {
    case 'Record trades and feelings':
      scores['Trader Journal'] += 50;
      break;
    case 'Turn plain-language ideas into trading code':
      scores['ZipLime'] += 50;
      break;
    case 'Build and optimize a diversified portfolio without coding':
      scores['Alpha Builder'] += 50;
      break;
    case 'Follow and learn from professional traders':
      scores['Copilot'] += 50;
      break;
    case 'Launch or advance a professional quant-trading career':
      scores['Quantum'] += 50;
      break;
    case 'Learn algorithmic trading from scratch':
      scores['Quantum Course'] += 50;
      break;
  }

  // Question 2: Trading Experience (25 points total)
  switch (answers.tradingExperience) {
    case 'Beginner':
      scores['Trader Journal'] += 15;
      scores['Quantum Course'] += 10;
      break;
    case 'Intermediate':
      scores['ZipLime'] += 12.5;
      scores['Alpha Builder'] += 12.5;
      break;
    case 'Advanced':
      scores['Alpha Builder'] += 12.5;
      scores['Quantum'] += 12.5;
      break;
  }

  // Question 3: Coding Comfort (15 points total)
  switch (answers.codingComfort) {
    case 'I prefer no coding':
      scores['Copilot'] += 8;
      scores['Alpha Builder'] += 7;
      break;
    case 'I\'m fine using AI to generate code':
      scores['ZipLime'] += 15;
      break;
    case 'I want to learn to code strategies myself':
      scores['Quantum Course'] += 15;
      break;
  }

  // Question 4: Mentorship Preference (10 points total)
  switch (answers.mentorshipPreference) {
    case 'No, I prefer to work independently':
      scores['Trader Journal'] += 4;
      scores['ZipLime'] += 3;
      scores['Alpha Builder'] += 3;
      break;
    case 'Yes, I\'d like expert insight or copy-trading':
      scores['Copilot'] += 5;
      scores['Quantum Course'] += 5;
      break;
    case 'Yes, and I\'m aiming for a professional quant role':
      scores['Quantum'] += 5;
      scores['Quantum Course'] += 5;
      break;
  }

  // Question 5: Current Tools (10 points total)
  switch (answers.currentTools) {
    case 'None – I\'m looking for a starting point':
      scores['Trader Journal'] += 5;
      scores['Quantum Course'] += 5;
      break;
    case 'I already record trades and want automation':
      scores['ZipLime'] += 5;
      scores['Alpha Builder'] += 5;
      break;
    case 'I use bots or signals and want to level up':
      scores['Quantum'] += 5;
      scores['Quantum Course'] += 5;
      break;
  }

  // Calculate total points
  const totalPoints = Object.values(scores).reduce((sum, points) => sum + points, 0);

  // Convert to percentages and create results
  const results: ProductScore[] = Object.entries(scores)
    .map(([name, points]) => ({
      name,
      points,
      percentage: totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0,
      explanation: PRODUCTS[name as keyof typeof PRODUCTS]?.description || ''
    }))
    .filter(result => result.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  return results;
}

export function getSurveyQuestion(questionNumber: number): string {
  const questions = [
    "What is your primary goal?",
    "What is your current trading experience?", 
    "How comfortable are you with coding?",
    "Do you want expert guidance or mentorship?",
    "Which tools do you currently use or prefer?"
  ];
  
  return questions[questionNumber - 1] || "";
}

export function getQuestionOptions(questionNumber: number): string[] {
  const options = [
    [
      "Record trades and feelings",
      "Turn plain-language ideas into trading code", 
      "Build and optimize a diversified portfolio without coding",
      "Follow and learn from professional traders",
      "Launch or advance a professional quant-trading career",
      "Learn algorithmic trading from scratch"
    ],
    ["Beginner", "Intermediate", "Advanced"],
    [
      "I prefer no coding",
      "I'm fine using AI to generate code", 
      "I want to learn to code strategies myself"
    ],
    [
      "No, I prefer to work independently",
      "Yes, I'd like expert insight or copy-trading",
      "Yes, and I'm aiming for a professional quant role"
    ],
    [
      "None – I'm looking for a starting point",
      "I already record trades and want automation", 
      "I use bots or signals and want to level up"
    ]
  ];
  
  return options[questionNumber - 1] || [];
}
