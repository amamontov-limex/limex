import { SurveyAnswers, calculateProductScores, getSurveyQuestion, getQuestionOptions } from './survey';

export interface ChatState {
  currentQuestion: number;
  answers: SurveyAnswers;
  isComplete: boolean;
}

export function processUserMessage(message: string, chatState: ChatState): { response: string; newState: ChatState } {
  const trimmedMessage = message.toLowerCase().trim();
  
  // Если это первый вопрос
  if (chatState.currentQuestion === 0) {
    return {
      response: "I'm here to assist you with a survey to recommend the best Limex products for your trading needs. Let's start with the first question: \"What is your primary goal?\" Options: 1. Record trades and feelings 2. Turn plain-language ideas into trading code 3. Build and optimize a diversified portfolio without coding 4. Follow and learn from professional traders 5. Launch or advance a professional quant-trading career 6. Learn algorithmic trading from scratch Please select the option that aligns with your primary goal.",
      newState: { ...chatState, currentQuestion: 1 }
    };
  }

  // Обработка ответов на вопросы
  if (chatState.currentQuestion >= 1 && chatState.currentQuestion <= 5) {
    const options = getQuestionOptions(chatState.currentQuestion);
    const selectedOption = findMatchingOption(trimmedMessage, options);
    
    if (selectedOption) {
      const newAnswers = { ...chatState.answers };
      
      // Сохраняем ответ
      switch (chatState.currentQuestion) {
        case 1:
          newAnswers.primaryGoal = selectedOption;
          break;
        case 2:
          newAnswers.tradingExperience = selectedOption;
          break;
        case 3:
          newAnswers.codingComfort = selectedOption;
          break;
        case 4:
          newAnswers.mentorshipPreference = selectedOption;
          break;
        case 5:
          newAnswers.currentTools = selectedOption;
          break;
      }

      const nextQuestion = chatState.currentQuestion + 1;
      
      if (nextQuestion <= 5) {
        // Задаем следующий вопрос
        const nextQuestionText = getSurveyQuestion(nextQuestion);
        const nextOptions = getQuestionOptions(nextQuestion);
        const optionsText = nextOptions.map((opt, index) => `${index + 1}. ${opt}`).join(' ');
        
        return {
          response: `Great! Now for question ${nextQuestion}: "${nextQuestionText}" Options: ${optionsText}`,
          newState: { ...chatState, answers: newAnswers, currentQuestion: nextQuestion }
        };
      } else {
        // Опрос завершен, показываем рекомендации
        const scores = calculateProductScores(newAnswers);
        const topRecommendations = scores.slice(0, 3);
        
        let response = "Thank you for completing the survey! Here are your personalized product recommendations:\n\n";
        
        topRecommendations.forEach((product, index) => {
          response += `${index + 1}. **${product.name}** (${product.percentage}% match)\n`;
          response += `   ${product.explanation}\n\n`;
        });
        
        response += "These recommendations are based on your answers and how they align with each product's features. Would you like to learn more about any of these products?";
        
        return {
          response,
          newState: { ...chatState, answers: newAnswers, currentQuestion: 6, isComplete: true }
        };
      }
    } else {
      // Неверный ответ, просим выбрать из вариантов
      const currentOptions = getQuestionOptions(chatState.currentQuestion);
      const optionsText = currentOptions.map((opt, index) => `${index + 1}. ${opt}`).join(' ');
      
      return {
        response: `Please select one of the available options: ${optionsText}`,
        newState: chatState
      };
    }
  }

  // Если опрос завершен, отвечаем на дополнительные вопросы
  if (chatState.isComplete) {
    return {
      response: "The survey is complete! You can ask me about any of the recommended products or start a new survey by typing 'restart'.",
      newState: chatState
    };
  }

  return {
    response: "I'm not sure how to help with that. Let's continue with the survey or you can ask about Limex products.",
    newState: chatState
  };
}

function findMatchingOption(message: string, options: string[]): string | null {
  // Поиск по номеру (1, 2, 3, etc.)
  const numberMatch = message.match(/\b(\d+)\b/);
  if (numberMatch) {
    const index = parseInt(numberMatch[1]) - 1;
    if (index >= 0 && index < options.length) {
      return options[index];
    }
  }
  
  // Поиск по ключевым словам
  const keywords = {
    'record trades': 'Record trades and feelings',
    'trading code': 'Turn plain-language ideas into trading code',
    'portfolio': 'Build and optimize a diversified portfolio without coding',
    'follow traders': 'Follow and learn from professional traders',
    'professional career': 'Launch or advance a professional quant-trading career',
    'learn algorithmic': 'Learn algorithmic trading from scratch',
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'no coding': 'I prefer no coding',
    'ai generate': 'I\'m fine using AI to generate code',
    'learn code': 'I want to learn to code strategies myself',
    'work independently': 'No, I prefer to work independently',
    'expert insight': 'Yes, I\'d like expert insight or copy-trading',
    'professional quant': 'Yes, and I\'m aiming for a professional quant role',
    'starting point': 'None – I\'m looking for a starting point',
    'automation': 'I already record trades and want automation',
    'level up': 'I use bots or signals and want to level up'
  };
  
  for (const [keyword, option] of Object.entries(keywords)) {
    if (message.includes(keyword)) {
      return option;
    }
  }
  
  return null;
}
