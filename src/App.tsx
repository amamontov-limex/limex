import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { sendMessageToOpenAI } from "@/lib/openai";

// ===== Brand =====
function Brand() {
  return (
    <a href="#" className="inline-flex items-center gap-2">
      <img 
        src="/images/limex_beta_logo.svg" 
        alt="Limex" 
        className="h-[25px] w-auto"
      />
    </a>
  );
}

// ===== Topbar (right icons) =====
function Topbar() {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <Button variant="secondary" onClick={() => window.open('https://beta.limex.com', '_blank')}>Log in</Button>
    </div>
  );
}

// ===== Sidebar (left nav) =====
const sidebarLinks = [
  "Overview",
  "Education",
  "Strategies",
  "Alpha",
  "Explore",
  "Careers",
  "Partnership",
];

function Sidebar() {
  return (
    <aside className="fixed left-6 top-6 hidden w-48 lg:block">
      <Brand />
      <nav className="mt-8 space-y-3 text-sm text-black">
        {sidebarLinks.map((l) => (
          <a key={l} href="#" className="group relative flex items-center justify-between hover:bg-gray-100 hover:text-black transition-colors px-3 py-2 rounded-md">
            <span className="leading-[1.375rem]">{l}</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
              ›
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}



// ===== Center Search =====
function CenterSearch({ isChatOpen, setIsChatOpen, onSurveyCompleted, onProductScoresChanged, onScenarioChange, activeScenario: parentActiveScenario }: { 
  isChatOpen: boolean; 
  setIsChatOpen: (open: boolean) => void;
  onSurveyCompleted: (completed: boolean) => void;
  onProductScoresChanged: (scores: Array<{product: string, points: number, percentage: number}>) => void;
  onScenarioChange?: (scenario: 'gold' | 'bitcoin' | 'stock' | null) => void;
  activeScenario?: 'gold' | 'bitcoin' | 'stock' | null;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'bot', isThinking?: boolean}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  const [showGoalChips, setShowGoalChips] = useState(false);
  const [showCodingChips, setShowCodingChips] = useState(false);
  const [showMentorshipChips, setShowMentorshipChips] = useState(false);
  const [showToolsChips, setShowToolsChips] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showProductsButton, setShowProductsButton] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{goal: string, coding: string, mentorship: string, tools: string}>({
    goal: '',
    coding: '',
    mentorship: '',
    tools: ''
  });
  const [dynamicChips, setDynamicChips] = useState<string[]>([]);
  const [showDynamicChips, setShowDynamicChips] = useState(false);
  const [aiInteractionCount, setAiInteractionCount] = useState(0);
  const [isInterfaceBlocked, setIsInterfaceBlocked] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [productScores, setProductScores] = useState<Array<{product: string, points: number, percentage: number}>>([]);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [isPhraseAnimating, setIsPhraseAnimating] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'gold' | 'bitcoin' | 'stock' | null>(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showInitialCTAs, setShowInitialCTAs] = useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  
  const initialChips = ["Find products for you", "What about my portfolio?", "Research", "Challenges", "Products"];
  const goalChips = ["Copy Trading", "Education", "Backtest my ideas", "AI instruments for trading"];
  const codingChips = ["I prefer no coding", "I'm fine using AI to generate code", "I want to learn to code strategies myself"];
  const mentorshipChips = ["No, I don't need", "Yes, I'd like expert insight or copy‑trading", "Yes, and I'm aiming for a professional quant role"];
  const toolsChips = ["None", "I already record trades", "I use bots or signals"];
  
  // Анимированные фразы
  const animatedPhrases = [
    "New knowledge",
    "Challenge your ideas", 
    "Demo trade for free"
  ];
  
  // Сценарии
  const scenarios = {
    gold: {
      title: "🏆 Gold Rally Challenge",
      subtitle: "Prove your market intuition",
      messages: [
        {
          delay: 1000,
          text: "Gold just hit $4,300 - the biggest rally since the 70s. Everyone's calling it 'a generational trade.'\n\nThe question is — did you see it coming?"
        },
        {
          delay: 4000,
          text: "Most young quants know they can spot opportunities… but can't prove it to anyone. No verified track record, no job offer, no capital to trade with."
        },
        {
          delay: 3000,
          text: "That's exactly why we built Limex Challenges - free competitions where you can trade simulated markets in real time, get a performance certificate, and even secure mentorship or internships in Limex Quantum partner firms."
        }
      ],
      ctaText: "🏆 Prove Your Edge - Join the Challenge",
      ctaLink: "https://challenges.limex.com",
      emailTitle: "Get Notified About Next Challenge",
      emailSubtitle: "New Challenge starts soon - 0 risk, full recognition"
    },
    bitcoin: {
      title: "₿ Bitcoin Crash Alert",
      subtitle: "Stop trading on emotions",
      messages: [
        {
          delay: 1000,
          text: "Bitcoin broke $100K… and then flash-crashed 15% within hours. Everyone called it 'market manipulation,' but it's just another FOMO cycle."
        },
        {
          delay: 4000,
          text: "Retail traders chase the hype. They buy tops, panic-sell bottoms, and never realize it's data — not luck — that separates consistent performance from random wins."
        },
        {
          delay: 3000,
          text: "With Limex Copilot, you get a personal crypto workspace where data and AI work for you:\n\n• Track on-chain sentiment and volatility in real time\n• Auto-follow strategies of verified traders\n• Get instant AI insights on your portfolio health\n• No coding — just your ideas, tracked and analyzed."
        }
      ],
      ctaText: "🚀 Open My Crypto Workspace",
      ctaLink: "https://beta.limex.com",
      emailTitle: "Get Your Crypto Workspace",
      emailSubtitle: "BTC volatility tracking and AI portfolio insights"
    },
    stock: {
      title: "📊 Stock Bubble Warning",
      subtitle: "Test your strategy before the crash",
      messages: [
        {
          delay: 1000,
          text: "IMF just warned of a possible U.S. market bubble — valuations are stretching far beyond fundamentals.\n\nEven top funds are rotating into cash, worried that one correction could erase this year's gains."
        },
        {
          delay: 4000,
          text: "The truth is — nobody can predict corrections. But you can test how your logic behaves when they happen."
        },
        {
          delay: 3000,
          text: "With Limex ZipLime, you can stress-test your strategy against real historical data — 2020, 2022, 2008 — and see exactly how it would've performed.\n\nNo coding, no setup — just input your idea and run instant AI-assisted backtests."
        }
      ],
      ctaText: "⚡ Run a Quick Backtest",
      ctaLink: "https://ziplime.limex.com",
      emailTitle: "Start Backtesting Your Strategy",
      emailSubtitle: "S&P volatility rising - test your strategy now"
    }
  };
  
  // Функция для генерации динамических вопросов
  const getNextQuestion = (currentAnswers: {goal: string, coding: string, mentorship: string, tools: string}, questionNumber: number) => {
    const { goal, coding } = currentAnswers;
    
    switch(questionNumber) {
      case 1: // После первого вопроса (goal)
        if (goal === 'Copy Trading') {
          return {
            question: "What type of traders would you like to follow?",
            chips: ["Professional traders", "Successful retail traders", "Quantitative strategies", "Any successful trader"],
            nextQuestionNumber: 2
          };
        } else if (goal === 'Education') {
          return {
            question: "What's your current trading experience level?",
            chips: ["Complete beginner", "Some experience", "Intermediate trader", "Advanced trader"],
            nextQuestionNumber: 2
          };
        } else if (goal === 'Backtest my ideas') {
          return {
            question: "What type of strategies do you want to test?",
            chips: ["Technical analysis", "Fundamental analysis", "Quantitative models", "Any strategy"],
            nextQuestionNumber: 2
          };
        } else if (goal === 'AI instruments for trading') {
          return {
            question: "What's your programming background?",
            chips: ["No programming experience", "Basic programming", "Intermediate programmer", "Advanced programmer"],
            nextQuestionNumber: 2
          };
        }
        break;
        
      case 2: // После второго вопроса
        if (goal === 'Copy Trading' && coding === 'Professional traders') {
          return {
            question: "How much capital are you planning to allocate?",
            chips: ["Under $1,000", "$1,000 - $10,000", "$10,000 - $50,000", "Over $50,000"],
            nextQuestionNumber: 3
          };
        } else if (goal === 'Education') {
          return {
            question: "What learning format do you prefer?",
            chips: ["Video courses", "Interactive tutorials", "Live sessions", "Self-paced materials"],
            nextQuestionNumber: 3
          };
        } else if (goal === 'Backtest my ideas') {
          return {
            question: "What markets are you most interested in?",
            chips: ["Forex", "Stocks", "Cryptocurrency", "Commodities"],
            nextQuestionNumber: 3
          };
        } else {
          return {
            question: "How comfortable are you with coding?",
            chips: ["I prefer no coding", "I'm fine using AI to generate code", "I want to learn to code strategies myself"],
            nextQuestionNumber: 3
          };
        }
        break;
        
      case 3: // После третьего вопроса
        return {
          question: "Do you want expert guidance or mentorship?",
          chips: ["No, I don't need", "Yes, I'd like expert insight or copy‑trading", "Yes, and I'm aiming for a professional quant role"],
          nextQuestionNumber: 4
        };
        
      case 4: // После четвертого вопроса
        return {
          question: "Which tools do you currently use or prefer?",
          chips: ["None", "I already record trades", "I use bots or signals"],
          nextQuestionNumber: 5
        };
        
      default:
        return null;
    }
  };

  // Система подсчета баллов
  const calculateProductScores = (answers: {goal: string, coding: string, mentorship: string, tools: string}) => {
    const scores: {[key: string]: number} = {
      'Trader Journal': 0,
      'ZipLime': 0,
      'Alpha Builder': 0,
      'Platform': 0,
      'Quantum': 0,
      'Quantum Course': 0
    };

    // Question 1: Primary goal (50 points)
    switch(answers.goal) {
      case 'Copy Trading':
        scores.Platform += 50;
        break;
      case 'Education':
        scores.Quantum += 50;
        break;
      case 'Backtest my ideas':
        scores.ZipLime += 50;
        break;
      case 'AI instruments for trading':
        scores['Alpha Builder'] += 50;
        break;
    }

    // Question 2: Coding comfort (15 points)
    switch(answers.coding) {
      case 'I prefer no coding':
        scores.Platform += 8;
        scores['Alpha Builder'] += 7;
        break;
      case "I'm fine using AI to generate code":
        scores.ZipLime += 15;
        break;
      case 'I want to learn to code strategies myself':
        scores['Quantum Course'] += 15;
        break;
    }

    // Question 3: Mentorship (10 points)
    switch(answers.mentorship) {
      case "No, I don't need":
        scores['Trader Journal'] += 4;
        scores.ZipLime += 3;
        scores['Alpha Builder'] += 3;
        break;
      case "Yes, I'd like expert insight or copy‑trading":
        scores.Platform += 5;
        scores['Quantum Course'] += 5;
        break;
      case "Yes, and I'm aiming for a professional quant role":
        scores.Quantum += 5;
        scores['Quantum Course'] += 5;
        break;
    }

    // Question 4: Tools (10 points)
    switch(answers.tools) {
      case 'None':
        scores['Trader Journal'] += 5;
        scores['Quantum Course'] += 5;
        break;
      case 'I already record trades':
        scores.ZipLime += 5;
        scores['Alpha Builder'] += 5;
        break;
      case 'I use bots or signals':
        scores.Quantum += 5;
        scores['Quantum Course'] += 5;
        break;
    }

    // Calculate percentages
    const totalPoints = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = Object.entries(scores).map(([product, points]) => ({
      product,
      points,
      percentage: totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);

    return percentages;
  };

  // Автоматическая прокрутка к последнему сообщения (только внутри чата)
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Функция для прокрутки до продуктов
  const scrollToProducts = () => {
    const productsSection = document.querySelector('section.mt-6');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Функция для переключения состояния чата
  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  // Плавное появление текста для сообщений
  const typeMessage = (text: string) => {
    setIsTyping(true);
    setIsInterfaceBlocked(true); // Блокируем интерфейс во время анимации
    
    // Сначала устанавливаем пустой текст
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.sender === 'bot') {
        lastMessage.text = '';
      }
      return newMessages;
    });
    
    // Через небольшую задержку показываем весь текст с плавной анимацией
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot') {
          lastMessage.text = text;
        }
        return newMessages;
      });
      
      // Разблокируем интерфейс после анимации
      setTimeout(() => {
        setIsTyping(false);
        setIsInterfaceBlocked(false);
        scrollToBottom();
      }, 300); // Небольшая задержка для завершения CSS анимации
    }, 200); // Задержка перед появлением текста
  };
  
  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log('🔍 Activating chat with message:', searchValue);
      setIsChatOpen(true);
      
      // Add user message
      const userMessage = { id: 1, text: searchValue, sender: 'user' as const };
      setMessages([userMessage]);
      
      // Add "AI is thinking" message
      const thinkingMessage = { id: 2, text: "AI is thinking...", sender: 'bot' as const, isThinking: true };
      setMessages(prev => [...prev, thinkingMessage]);
      
      // Send to OpenAI
      const openAIMessages = [
        { role: 'user' as const, content: searchValue }
      ];
      
      sendMessageToOpenAI(openAIMessages)
        .then((botResponse) => {
          // Remove thinking message and add real response
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const botMessage = { id: 2, text: botResponse, sender: 'bot' as const };
          setMessages(prev => [...prev, botMessage]);
          
          // Show goal chips if AI asks about primary goal
          if (botResponse.toLowerCase().includes('primary goal') || botResponse.toLowerCase().includes('what is your')) {
            setShowGoalChips(true);
          }
        })
        .catch((error) => {
          console.error('Error getting AI response:', error);
          // Remove thinking message and add error
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const errorMessage = { id: 2, text: "Sorry, there was an error processing your request. Please try again.", sender: 'bot' as const };
          setMessages(prev => [...prev, errorMessage]);
        });
      
      setSearchValue(""); // Clear the search field
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Функции для сохранения данных пользователя
  const saveUserData = () => {
    const userData = {
      timestamp: new Date().toISOString(),
      userAnswers,
      productScores,
      surveyCompleted,
      aiInteractionCount,
      messages: messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date().toISOString()
      }))
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('limex_user_data', JSON.stringify(userData));
    console.log('💾 User data saved to localStorage');
  };



  // Функция для сброса состояния опроса
  const resetSurvey = () => {
    setCurrentQuestion(0);
    setUserAnswers({
      goal: '',
      coding: '',
      mentorship: '',
      tools: ''
    });
    setShowGoalChips(false);
    setShowCodingChips(false);
    setShowMentorshipChips(false);
    setShowToolsChips(false);
    setShowDynamicChips(false);
    setDynamicChips([]);
    setMessages([]);
    setAiInteractionCount(0);
    setSurveyCompleted(false);
    setProductScores([]);
    setShowProductsButton(false);
    console.log('🔄 Survey reset');
  };

  const handleChipClick = (chipText: string) => {
    console.log('🔘 Chip clicked:', chipText);
    console.log('📊 Current question:', currentQuestion);
    console.log('📋 User answers:', userAnswers);
    
    // Проверяем, заблокирован ли интерфейс
    if (isInterfaceBlocked) {
      console.log('🚫 Interface is blocked during AI typing');
      return;
    }
    
    // Проверяем лимит взаимодействий с ИИ
    if (aiInteractionCount >= 50) {
      const limitMessage = { id: Date.now(), text: "You've reached the limit of 50 interactions with the AI assistant. Please start a new session or contact support for assistance.", sender: 'bot' as const };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }
    
    setIsChatOpen(true);
    
    // Увеличиваем счетчик взаимодействий для чипов
    setAiInteractionCount(prev => {
      const newCount = prev + 1;
      
      // Предупреждение при приближении к лимиту
      if (newCount === 45) {
        const warningMessage = { id: Date.now() + 0.5, text: "⚠️ You have 5 interactions remaining with the AI assistant.", sender: 'bot' as const };
        setMessages(prev => [...prev, warningMessage]);
      }
      
      return newCount;
    });
    
    // Special handling for "Find products for you" chip
    if (chipText === "Find products for you") {
      // Проверяем, не начат ли уже опрос
      if (currentQuestion > 0) {
        console.log('⚠️ Survey already started, current question:', currentQuestion);
        return;
      }
      
      // Set current question to 1 (first question)
      setCurrentQuestion(1);
      
      // Add user message with "Find products"
      const userMessage = { id: Date.now(), text: "Find products", sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Add empty AI message first
      const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
      setMessages(prev => [...prev, botMessage]);
      
      // Start typing effect after a short delay
      setTimeout(() => {
        typeMessage("What is your primary goal?");
      }, 1000);
      
      // Show goal chips immediately
      setShowGoalChips(true);
      return;
    }
    
    // Handle goal chips (first question) - теперь используем динамические вопросы
    if (goalChips.includes(chipText)) {
      // Проверяем, что мы действительно на первом вопросе
      if (currentQuestion !== 1) {
        console.log('⚠️ Not on question 1, current question:', currentQuestion);
        return;
      }
      
      setShowGoalChips(false);
      setCurrentQuestion(2); // Переходим ко второму вопросу
      
      // Save user answer
      setUserAnswers(prev => ({ ...prev, goal: chipText }));
      
      // Add user message
      const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Показываем кнопку "Show" после первого ответа
      setShowProductsButton(true);
      
      // Обновляем productScores после первого ответа
      const updatedAnswers = { ...userAnswers, goal: chipText };
      const scores = calculateProductScores(updatedAnswers);
      setProductScores(scores);
      onProductScoresChanged(scores);
      
      // Get next question dynamically
      const nextQuestionData = getNextQuestion(updatedAnswers, 1);
      
      if (nextQuestionData) {
        // Add empty AI message first
        const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
        setMessages(prev => [...prev, botMessage]);
        
        // Start typing effect after a short delay
        setTimeout(() => {
          typeMessage(nextQuestionData.question);
        }, 1000);
        
        // Show dynamic chips after typing is complete
        setTimeout(() => {
          setDynamicChips(nextQuestionData.chips);
          setShowDynamicChips(true);
        }, 3000);
      }
      return;
    }
    
    // Handle dynamic chips (for questions 2-4)
    if (dynamicChips.includes(chipText)) {
      setShowDynamicChips(false);
      
      // Save user answer based on current question
      const updatedAnswers = { ...userAnswers };
      if (currentQuestion === 2) {
        updatedAnswers.coding = chipText;
      } else if (currentQuestion === 3) {
        updatedAnswers.mentorship = chipText;
      } else if (currentQuestion === 4) {
        updatedAnswers.tools = chipText;
      }
      
      setUserAnswers(updatedAnswers);
      setCurrentQuestion(prev => prev + 1);
      
      // Обновляем productScores после каждого ответа
      const scores = calculateProductScores(updatedAnswers);
      setProductScores(scores);
      onProductScoresChanged(scores);
      
      // Add user message
      const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Get next question dynamically
      const nextQuestionData = getNextQuestion(updatedAnswers, currentQuestion + 1);
      
      if (nextQuestionData && currentQuestion < 4) {
        // Add empty AI message first
        const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
        setMessages(prev => [...prev, botMessage]);
        
        // Start typing effect after a short delay
        setTimeout(() => {
          typeMessage(nextQuestionData.question);
        }, 1000);
        
        // Show dynamic chips after typing is complete
        setTimeout(() => {
          setDynamicChips(nextQuestionData.chips);
          setShowDynamicChips(true);
        }, 3000);
      } else {
        // Final question reached - calculate scores and show recommendations
        const scores = calculateProductScores(updatedAnswers);
        const topRecommendations = scores.filter(score => score.percentage > 0).slice(0, 3);
        
        // Save survey results
        setSurveyCompleted(true);
        setProductScores(scores);
        
        // Уведомляем родительский компонент
        onSurveyCompleted(true);
        onProductScoresChanged(scores);
        
        // Сохраняем данные пользователя
        setTimeout(() => {
          saveUserData();
        }, 1000); // Сохраняем через секунду после завершения опроса
        
        // Create personalized response
        let response = "Based on your answers we recommend you products below:\n\n";
        
        topRecommendations.forEach((rec, index) => {
          response += `${index + 1}. **${rec.product}** (${rec.percentage}% match)\n`;
        });
        
        response += "\nThese recommendations are tailored to your specific needs and preferences.";
        
        // Add AI response with recommendations
        const botMessage = { id: Date.now() + 1, text: response, sender: 'bot' as const };
        setMessages(prev => [...prev, botMessage]);
      }
      return;
    }
    
    // Handle coding chips (second question) - старый код для совместимости (ОТКЛЮЧЕН)
    if (false && codingChips.includes(chipText)) {
      setShowCodingChips(false);
      setCurrentQuestion(2);
      
      // Save user answer
      setUserAnswers(prev => ({ ...prev, coding: chipText }));
      
      // Add user message
      const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Add empty AI message first
      const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
      setMessages(prev => [...prev, botMessage]);
      
      // Start typing effect after a short delay
      setTimeout(() => {
        typeMessage("Do you want expert guidance or mentorship?");
      }, 1000);
      
      // Show mentorship chips after typing is complete
      setTimeout(() => {
        setShowMentorshipChips(true);
      }, 3000);
      return;
    }
    
    // Handle mentorship chips (third question) - старый код для совместимости (ОТКЛЮЧЕН)
    if (false && mentorshipChips.includes(chipText)) {
      setShowMentorshipChips(false);
      setCurrentQuestion(3);
      
      // Save user answer
      setUserAnswers(prev => ({ ...prev, mentorship: chipText }));
      
      // Add user message
      const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Add empty AI message first
      const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
      setMessages(prev => [...prev, botMessage]);
      
      // Start typing effect after a short delay
      setTimeout(() => {
        typeMessage("Which tools do you currently use or prefer?");
      }, 1000);
      
      // Show tools chips after typing is complete
      setTimeout(() => {
        setShowToolsChips(true);
      }, 3000);
      return;
    }
    
    // Handle tools chips (fourth question) - старый код для совместимости (ОТКЛЮЧЕН)
    if (false && toolsChips.includes(chipText)) {
      setShowToolsChips(false);
      setCurrentQuestion(4);
      
      // Save user answer
      setUserAnswers(prev => ({ ...prev, tools: chipText }));
      
      // Add user message
      const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      
      // Calculate product scores
      const scores = calculateProductScores({ ...userAnswers, tools: chipText });
      const topRecommendations = scores.filter(score => score.percentage > 0).slice(0, 3);
      
      // Create personalized response
      let response = "Thank you for your answers! Based on your preferences, here are your personalized product recommendations:\n\n";
      
      topRecommendations.forEach((rec, index) => {
        response += `${index + 1}. **${rec.product}** (${rec.percentage}% match)\n`;
        response += `   Based on your answers: ${userAnswers.goal}, ${userAnswers.coding}, ${userAnswers.mentorship}, ${chipText}\n\n`;
      });
      
      response += "These recommendations are tailored to your specific needs and preferences. Would you like to learn more about any of these products?";
      
      // Add AI response with recommendations using typing effect
      const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
      setMessages(prev => [...prev, botMessage]);
      
      // Use typing effect for the response
      setTimeout(() => {
        typeMessage(response);
      }, 100);
      return;
    }
    
    // Add user message to existing messages
    const userMessage = { id: Date.now(), text: chipText, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    
    // Add "AI is thinking" message
    const thinkingMessage = { id: Date.now() + 1, text: "AI is thinking...", sender: 'bot' as const, isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);
    
    // Prepare messages for OpenAI (include conversation history)
    const openAIMessages = [
      ...messages.map(msg => ({ 
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const, 
        content: msg.text 
      })),
      { role: 'user' as const, content: chipText }
    ];
    
    sendMessageToOpenAI(openAIMessages)
      .then((botResponse) => {
        // Remove thinking message and add real response
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        const botMessage = { id: Date.now() + 2, text: botResponse, sender: 'bot' as const };
        setMessages(prev => [...prev, botMessage]);
        
        // Show goal chips if AI asks about primary goal
        if (botResponse.toLowerCase().includes('primary goal') || botResponse.toLowerCase().includes('what is your')) {
          setShowGoalChips(true);
        }
      })
      .catch((error) => {
        console.error('Error getting AI response:', error);
        // Remove thinking message and add error
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        const errorMessage = { id: Date.now() + 2, text: "Sorry, there was an error processing your request. Please try again.", sender: 'bot' as const };
        setMessages(prev => [...prev, errorMessage]);
      });
  };

  const handleSendMessage = () => {
    console.log('🚀 handleSendMessage called!');
    console.log('📝 newMessage:', newMessage);
    console.log('📝 newMessage.trim():', newMessage.trim());
    
    // Проверяем, заблокирован ли интерфейс
    if (isInterfaceBlocked) {
      console.log('🚫 Interface is blocked during AI typing');
      return;
    }
    
    // Проверяем лимит взаимодействий с ИИ
    if (aiInteractionCount >= 50) {
      const limitMessage = { id: Date.now(), text: "You've reached the limit of 50 interactions with the AI assistant. Please start a new session or contact support for assistance.", sender: 'bot' as const };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }
    
    if (newMessage.trim()) {
      const userMessage = { id: Date.now(), text: newMessage, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");
      
      // Увеличиваем счетчик взаимодействий
      setAiInteractionCount(prev => {
        const newCount = prev + 1;
        
        // Предупреждение при приближении к лимиту
        if (newCount === 45) {
          const warningMessage = { id: Date.now() + 0.5, text: "⚠️ You have 5 interactions remaining with the AI assistant.", sender: 'bot' as const };
          setMessages(prev => [...prev, warningMessage]);
        }
        
        return newCount;
      });
      
      // Если мы в процессе опроса, обрабатываем ответ как чип
      if (currentQuestion > 0 && currentQuestion < 5) {
        // Определяем, какой тип ответа это может быть
        const lowerMessage = newMessage.toLowerCase();
        
        // Проверяем, соответствует ли ответ одному из чипов
        let matchedChip = null;
        
        if (currentQuestion === 1) {
          // Проверяем goal chips с более гибким сопоставлением
          for (const chip of goalChips) {
            const chipLower = chip.toLowerCase();
            const messageLower = lowerMessage.toLowerCase();
            
            // Проверяем различные варианты совпадений
            if (messageLower.includes(chipLower) || 
                chipLower.includes(messageLower) ||
                (messageLower.includes('copy') && chipLower.includes('copy')) ||
                (messageLower.includes('education') && chipLower.includes('education')) ||
                (messageLower.includes('backtest') && chipLower.includes('backtest')) ||
                (messageLower.includes('ai') && chipLower.includes('ai'))) {
              matchedChip = chip;
              break;
            }
          }
        } else if (currentQuestion >= 2) {
          // Проверяем dynamic chips
          for (const chip of dynamicChips) {
            if (lowerMessage.includes(chip.toLowerCase()) || chip.toLowerCase().includes(lowerMessage)) {
              matchedChip = chip;
              break;
            }
          }
        }
        
        if (matchedChip) {
          // Обрабатываем как чип
          console.log('🎯 Found matching chip:', matchedChip, 'for message:', newMessage);
          handleChipClick(matchedChip);
          return;
        } else {
          // Если не нашли совпадение, просим выбрать из предложенных вариантов
          console.log('❌ No matching chip found for message:', newMessage);
          console.log('📋 Available chips:', currentQuestion === 1 ? goalChips : dynamicChips);
          const botMessage = { id: Date.now() + 1, text: "", sender: 'bot' as const };
          setMessages(prev => [...prev, botMessage]);
          
          // Use typing effect for the response
          setTimeout(() => {
            typeMessage("Please select one of the options above to continue.");
          }, 100);
          return;
        }
      }
      
      // Обычная обработка для случаев вне опроса
      // Add "AI is thinking" message
      const thinkingMessage = { id: Date.now() + 1, text: "AI is thinking...", sender: 'bot' as const, isThinking: true };
      setMessages(prev => [...prev, thinkingMessage]);
      
      // Prepare messages for OpenAI (include conversation history)
      const openAIMessages = [
        ...messages.map(msg => ({ 
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const, 
          content: msg.text 
        })),
        { role: 'user' as const, content: newMessage }
      ];
      
      // Get response from OpenAI
      sendMessageToOpenAI(openAIMessages)
        .then((botResponse) => {
          // Remove thinking message and add real response with typing effect
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const botMessage = { id: Date.now() + 2, text: "", sender: 'bot' as const };
          setMessages(prev => [...prev, botMessage]);
          
          // Use typing effect for the response
          setTimeout(() => {
            typeMessage(botResponse);
          }, 100);
          
          // НЕ показываем чипы автоматически - они управляются только через handleChipClick
        })
        .catch((error) => {
          console.error('Error getting AI response:', error);
          // Remove thinking message and add error with typing effect
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const errorMessage = { id: Date.now() + 2, text: "", sender: 'bot' as const };
          setMessages(prev => [...prev, errorMessage]);
          
          // Use typing effect for the error message
          setTimeout(() => {
            typeMessage("Sorry, there was an error processing your request. Please try again.");
          }, 100);
        });
    }
  };

  // Управляем последовательностью анимаций
  useEffect(() => {
    if (isChatOpen) {
      // Сначала ждем 2 секунды пока поле ввода встанет на место
      const timer1 = setTimeout(() => {
        setShowMessages(true);
      }, 2000);
      
      return () => clearTimeout(timer1);
    } else {
      setShowMessages(false);
    }
  }, [isChatOpen]);

  // Автоматическая прокрутка при появлении новых сообщений
  useEffect(() => {
    if (messages.length > 0 && showMessages) {
      scrollToBottom();
    }
  }, [messages, showMessages]);

  // Автоматический запуск сценария при выборе из карточек выше
  useEffect(() => {
    if (parentActiveScenario && activeScenario !== parentActiveScenario) {
      runScenario(parentActiveScenario);
    }
  }, [parentActiveScenario]);

  // Функция запуска сценария
  const runScenario = (scenarioType: 'gold' | 'bitcoin' | 'stock') => {
    const scenario = scenarios[scenarioType];
    setActiveScenario(scenarioType);
    setShowInitialCTAs(false);
    setMessages([]);
    setScenarioStep(0);
    setShowEmailForm(false);
    
    // Уведомляем родительский компонент
    if (onScenarioChange) {
      onScenarioChange(scenarioType);
    }
    
    // Добавляем сообщение пользователя - полный текст заголовка
    const userMessageText = scenarioType === 'gold' 
      ? 'Gold just hit record highs — how can I turn insights like that into real trading experience?'
      : scenarioType === 'bitcoin'
      ? 'How can I build a crypto strategy that survives FOMO and flash crashes?'
      : 'IMF warned of a market bubble — how can I test my strategy before the crash?';
    
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user' as const
    };
    setMessages([userMessage]);
    setIsChatOpen(true);
    
    // Запускаем ответы AI с задержками между сообщениями
    let cumulativeDelay = 500;
    
    scenario.messages.forEach((step, index) => {
      setTimeout(() => {
        const botMessage = { 
          id: Date.now() + index + 1000, 
          text: step.text, 
          sender: 'bot' as const 
        };
        setMessages(prev => [...prev, botMessage]);
        setScenarioStep(index + 1);
        
        // После последнего сообщения показываем CTA
        if (index === scenario.messages.length - 1) {
          setTimeout(() => {
            setScenarioStep(scenario.messages.length + 1);
          }, 2000);
        }
      }, cumulativeDelay);
      
      cumulativeDelay += step.delay;
    });
  };

  // Автоматическая смена фраз каждые 3 секунды с плавной анимацией
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPhraseAnimating(true);
      
      // Сначала скрываем текущую фразу
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % animatedPhrases.length);
        setIsPhraseAnimating(false);
      }, 400); // Половина времени анимации для fade out
    }, 3000);

    return () => clearInterval(interval);
  }, [animatedPhrases.length]);

  return (
    <section className="pt-8">
      <div className="mx-auto max-w-4xl px-3">
        {/* Chat Container - динамическая высота */}
        <div className={`flex flex-col transition-all duration-[2000ms] ease-out ${
          isChatOpen 
            ? (isChatExpanded ? 'h-[520px]' : 'h-[200px]')
            : 'h-[128px]'
        }`}>
          {/* Messages */}
          {isChatOpen && (
            <div ref={messagesContainerRef} className="flex-1 px-3 py-4 overflow-y-auto">
              <div className={`space-y-6 transition-all duration-1000 ease-in-out ${
                showMessages ? 'opacity-100' : 'opacity-0'
              }`}>
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-2000 ease-in-out ${
                      showMessages 
                        ? 'transform translate-y-0 opacity-100' 
                        : 'transform translate-y-12 opacity-0'
                    }`}
                                style={{
                                  transitionDelay: showMessages ? `${index === 0 ? 0 : 1000}ms` : '0ms'
                                }}
                  >
                    <div className="max-w-[85%]">
                      {/* Метка отправителя */}
                      <div className={`text-xs font-medium mb-1 px-2 ${
                        message.sender === 'user' 
                          ? 'text-right text-gray-500' 
                          : 'text-left text-gray-500'
                      }`}>
                        {message.sender === 'user' ? 'You' : 'Limex AI'}
                      </div>
                      
                      {/* Сообщение */}
                      <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-transparent text-gray-900 rounded-tr-sm border border-gray-300' 
                          : 'bg-gray-100 text-gray-900 rounded-tl-sm border border-gray-200'
                      }`}>
                        {message.isThinking ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{message.text}</span>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <span className={`transition-all duration-500 ease-in-out whitespace-pre-wrap ${
                              message.text ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                            }`}>
                              {message.text}
                            </span>
                            {isTyping && message.sender === 'bot' && message.text === "" && (
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Search Interface - фиксированное внизу */}
          <div className="flex-shrink-0">
          {isChatOpen && showGoalChips && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {goalChips.map((c) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                    isInterfaceBlocked 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:scale-105 hover:bg-gray-300'
                  }`}
                  onClick={() => !isInterfaceBlocked && handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
              <Badge 
                variant="outline" 
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  isInterfaceBlocked 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:scale-105 hover:bg-red-50 hover:text-red-600'
                }`}
                onClick={() => !isInterfaceBlocked && resetSurvey()}
              >
                Start over
              </Badge>
            </div>
          )}
          {isChatOpen && showCodingChips && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {codingChips.map((c) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className="rounded-full px-4 py-2 text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-gray-300"
                  onClick={() => handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          )}
          {isChatOpen && showMentorshipChips && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {mentorshipChips.map((c) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className="rounded-full px-4 py-2 text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-gray-300"
                  onClick={() => handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          )}
          {isChatOpen && showToolsChips && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {toolsChips.map((c) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className="rounded-full px-4 py-2 text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-gray-300"
                  onClick={() => handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          )}
          {isChatOpen && showDynamicChips && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {dynamicChips.map((c) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                    isInterfaceBlocked 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:scale-105 hover:bg-gray-300'
                  }`}
                  onClick={() => !isInterfaceBlocked && handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
              <Badge 
                variant="outline" 
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  isInterfaceBlocked 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:scale-105 hover:bg-red-50 hover:text-red-600'
                }`}
                onClick={() => !isInterfaceBlocked && resetSurvey()}
              >
                Start over
              </Badge>
            </div>
          )}

          {/* Email Form */}
          {activeScenario && showEmailForm && (
            <div className={`mb-4 p-6 rounded-xl border-2 shadow-lg ${
              activeScenario === 'gold'
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                : activeScenario === 'bitcoin'
                ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
            }`}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{scenarios[activeScenario].emailTitle}</h3>
                <p className="text-sm text-gray-600">{scenarios[activeScenario].emailSubtitle}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`flex-1 ${
                    activeScenario === 'gold'
                      ? 'border-yellow-300 focus:border-yellow-500'
                      : activeScenario === 'bitcoin'
                      ? 'border-orange-300 focus:border-orange-500'
                      : 'border-blue-300 focus:border-blue-500'
                  }`}
                />
                <Button 
                  className={`font-semibold ${
                    activeScenario === 'gold'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : activeScenario === 'bitcoin'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => {
                    if (userEmail) {
                      // Здесь можно добавить отправку email на сервер
                      console.log('Email submitted:', userEmail, 'for scenario:', activeScenario);
                      alert(`Thank you! We'll send you updates about ${scenarios[activeScenario].emailTitle}.`);
                      window.open(scenarios[activeScenario].ctaLink, '_blank');
                    }
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
          
          {/* AI Interaction Counter */}
          {isChatOpen && aiInteractionCount > 0 && !activeScenario && (
            <div className="mb-2 text-center">
              <span className="text-xs text-gray-500">
                AI interactions: {aiInteractionCount}/50
                {aiInteractionCount >= 45 && (
                  <span className="text-orange-500 font-semibold"> (⚠️ Approaching limit)</span>
                )}
                {aiInteractionCount >= 50 && (
                  <span className="text-red-500 font-semibold"> (❌ Limit reached)</span>
                )}
              </span>
            </div>
          )}
          
          
          
          {/* Input field */}
          <div className={`flex items-center rounded-2xl border-2 border-gray-300 bg-background px-4 py-3 shadow-md ${
            isInterfaceBlocked ? 'opacity-50' : ''
          }`}>
            <Input
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-semibold placeholder:font-normal"
              placeholder={isChatOpen ? (isInterfaceBlocked ? "AI is typing..." : "Type your message...") : "Ask Limex AI"}
              aria-label="Ask Limex"
              value={isChatOpen ? newMessage : searchValue}
              onChange={(e) => !isInterfaceBlocked && (isChatOpen ? setNewMessage(e.target.value) : setSearchValue(e.target.value))}
              onKeyPress={(e) => !isInterfaceBlocked && e.key === 'Enter' && (isChatOpen ? handleSendMessage() : handleKeyPress(e))}
              disabled={isInterfaceBlocked}
            />
            <Button 
              size="icon" 
              className={`ml-2 rounded-xl transition-colors ${
                (isChatOpen ? newMessage.trim() : searchValue.trim())
                  ? 'bg-black hover:bg-gray-900 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } ${isInterfaceBlocked ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label="Go"
              onClick={() => {
                if (isInterfaceBlocked) {
                  console.log('🚫 Interface is blocked during AI typing');
                  return;
                }
                if (isChatOpen) {
                  handleSendMessage();
                } else {
                  handleSearch();
                }
              }}
              disabled={isInterfaceBlocked || !(isChatOpen ? newMessage.trim() : searchValue.trim())}
            >
              <ArrowUpRight className="size-5" />
            </Button>
            
            {/* Кнопка для сворачивания чата */}
            {isChatOpen && isChatExpanded && (
              <Button 
                size="sm" 
                className="ml-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1"
                onClick={toggleChatExpansion}
              >
                <ChevronUp className="size-4" />
                Collapse
              </Button>
            )}
            
            {/* Кнопка для раскрытия чата */}
            {isChatOpen && !isChatExpanded && (
              <Button 
                size="sm" 
                className="ml-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1"
                onClick={toggleChatExpansion}
              >
                <ChevronDown className="size-4" />
                Expand
              </Button>
            )}
            
            {/* Кнопка Show для прокрутки до продуктов */}
            {isChatOpen && showProductsButton && (
              <Button 
                size="sm" 
                className="ml-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={scrollToProducts}
              >
                Show
              </Button>
            )}
          </div>
          </div>
        </div>
      </div>
      
      
      <div className="mx-auto max-w-4xl px-3">
        {/* Карточка с АЛЬТЕРНАТИВНЫМ вопросом под чатом */}
        {activeScenario && (
          <div className="mt-6">
            <button
              onClick={() => {
                // Показываем ДРУГОЙ вопрос (не текущий)
                const questionText = activeScenario === 'gold' 
                  ? 'How can I build a crypto strategy that survives FOMO and flash crashes?'
                  : activeScenario === 'bitcoin'
                  ? 'Gold just hit record highs — how can I turn insights like that into real trading experience?'
                  : 'Gold just hit record highs — how can I turn insights like that into real trading experience?';
                
                const newScenario = activeScenario === 'gold'
                  ? 'bitcoin' as const
                  : activeScenario === 'bitcoin'
                  ? 'gold' as const
                  : 'gold' as const;
                
                // Переключаем сценарий
                setActiveScenario(newScenario);
                runScenario(newScenario);
              }}
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-200 cursor-pointer text-left"
            >
              <div className="flex items-start gap-4">
                {/* Показываем иконку ДРУГОГО сценария */}
                {activeScenario === 'gold' ? (
                  <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#F7931A" stroke="#E07A00" strokeWidth="3"/>
                    <text x="50" y="65" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Arial">₿</text>
                  </svg>
                ) : activeScenario === 'bitcoin' ? (
                  <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="60" width="15" height="30" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="30" y="45" width="15" height="45" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="50" y="30" width="15" height="60" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="70" y="15" width="15" height="75" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <path d="M 17 75 L 37 60 L 57 45 L 77 20 L 90 10" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M 85 15 L 90 10 L 95 15" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="60" width="15" height="30" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="30" y="45" width="15" height="45" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="50" y="30" width="15" height="60" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <rect x="70" y="15" width="15" height="75" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
                    <path d="M 17 75 L 37 60 L 57 45 L 77 20 L 90 10" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M 85 15 L 90 10 L 95 15" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <div className="flex-1">
                  <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed">
                    {activeScenario === 'gold' 
                      ? 'How can I build a crypto strategy that survives FOMO and flash crashes?'
                      : activeScenario === 'bitcoin'
                      ? 'Gold just hit record highs — how can I turn insights like that into real trading experience?'
                      : 'Gold just hit record highs — how can I turn insights like that into real trading experience?'
                    }
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
      
      {/* CSS анимации для фраз */}
      <style>{`
        @keyframes phraseFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes phraseFadeOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
        }
        
        .phrase-animate-in {
          animation: phraseFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .phrase-animate-out {
          animation: phraseFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
}

// ===== Featured Grid =====
function FeaturedGrid({ surveyCompleted, productScores }: { surveyCompleted: boolean, productScores: Array<{product: string, points: number, percentage: number}> }) {
  const items = [
    {
      title: "Challenges",
      desc: "For quants, algo traders and researchers",
      link: "https://challenges.limex.com",
      productName: "Challenges"
    },
    {
      title: "Education",
      desc: "Learn algorithmic trading from experts",
      link: "https://promo.limex.com",
      productName: "Education"
    },
    {
      title: "Copy Trading",
      desc: "Follow successful traders and strategies",
      link: "https://beta.limex.com",
      productName: "Copy Trading"
    },
    {
      title: "Free Trade",
      desc: "Demo trade for free without risk",
      link: "https://beta.limex.com",
      productName: "Free Trade"
    },
  ];

  // Сортируем карточки на основе результатов опроса
  const sortedItems = surveyCompleted && productScores.length > 0 
    ? items.sort((a, b) => {
        const scoreA = productScores.find(s => s.product === a.productName)?.percentage || 0;
        const scoreB = productScores.find(s => s.product === b.productName)?.percentage || 0;
        return scoreB - scoreA; // Сортируем по убыванию баллов
      })
    : items;

  const handleCardClick = (link: string | null) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  // Функция для получения процента рекомендации карточки
  const getRecommendationPercentage = (productName: string) => {
    if (!productScores.length) return 0;
    const score = productScores.find(s => s.product === productName);
    return score ? score.percentage : 0;
  };


  // Компонент для динамического бейджа "Recommended"
  const RecommendedBadge = ({ productName }: { productName: string }) => {
    const percentage = getRecommendationPercentage(productName);
    const [isVisible, setIsVisible] = useState(false);
    const [fillPercentage, setFillPercentage] = useState(0);

    useEffect(() => {
      if (percentage > 0) {
        // Показываем бейдж с задержкой
        setTimeout(() => {
          setIsVisible(true);
          // Заполняем прогресс-бар с анимацией
          setTimeout(() => {
            setFillPercentage(percentage);
          }, 300);
        }, 200);
      } else {
        setIsVisible(false);
        setFillPercentage(0);
      }
    }, [percentage]);

    if (!isVisible) return null;

    return (
      <div className="absolute top-4 right-4 z-10">
        <div className="relative bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg border border-white/30 overflow-hidden">
          {/* Фон прогресс-бара */}
          <div className="absolute inset-0 bg-green-500/20"></div>
          
          {/* Заполняющийся зеленый фон */}
          <div 
            className="absolute inset-0 bg-green-500 transition-all duration-1000 ease-out"
            style={{ 
              width: `${fillPercentage}%`,
              transitionDelay: '200ms'
            }}
          ></div>
          
          {/* Текст поверх прогресс-бара */}
          <span className="relative z-10 text-white drop-shadow-sm">
            Recommended {Math.round(fillPercentage)}%
          </span>
        </div>
      </div>
    );
  };

  // Компонент для анимированной карточки
  const AnimatedCard = ({ 
    item, 
    index, 
    isFirst, 
    isSecond, 
    isThird 
  }: { 
    item: any, 
    index: number, 
    isFirst: boolean, 
    isSecond: boolean, 
    isThird: boolean 
  }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (surveyCompleted && productScores.length > 0) {
        setIsAnimating(true);
        // Сбрасываем анимацию через время
        setTimeout(() => {
          setIsAnimating(false);
        }, 1500);
      }
    }, [surveyCompleted, productScores]);

    // Определяем размеры карточки для сетки 3x3 (каждая карточка 1x1)
    const getCardSize = () => {
      return "rounded-3xl overflow-hidden h-full w-full";
    };

    // Определяем размер текста для карточек 1x1
    const getTextSize = () => {
      return "text-lg";
    };

    // Определяем изображение для каждой карточки
    const getCardImage = () => {
      switch(item.productName) {
        case 'Challenges':
          return '/images/challenges.png';
        case 'Education':
          return '/images/Chess.png';
        case 'Copy Trading':
          return '/images/Person .png';
        case 'Free Trade':
          return '/images/Journal.png';
        default:
          return '/images/abstract-representation-of-a-digital-copilot-in-a-.png';
      }
    };

    return (
      <Card 
        className={`${getCardSize()} bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-1000 ease-out ${
          isAnimating ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
        }`}
        onClick={() => handleCardClick(item.link)}
        style={{
          transitionDelay: `${index * 200}ms`,
          animation: isAnimating ? 'cardPulse 1.5s ease-in-out' : 'none'
        }}
      >
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img 
            src={getCardImage()} 
            alt={item.title} 
            className="w-full h-full object-cover filter blur-[7px] brightness-75 group-hover:blur-[3px] group-hover:brightness-90 transition-all duration-500"
          />
        </div>
        
        {/* Content Overlay */}
        <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className={`${getTextSize()} font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300`}>
              {item.title}
            </div>
          </div>
        </CardContent>
        
        {/* Description */}
        <div className="absolute bottom-6 left-6 z-10">
          <p className="text-white drop-shadow-lg font-medium">{item.desc}</p>
        </div>
        
        {/* Recommended Badge */}
        <RecommendedBadge productName={item.productName} />
      </Card>
    );
  };

  return (
    <section className="mt-6">
      {/* CSS анимации */}
      <style>{`
        @keyframes cardPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes cardSlideIn {
          0% { 
            transform: translateY(50px) scale(0.9); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        
        .card-animate {
          animation: cardSlideIn 0.8s ease-out forwards;
        }
      `}</style>
      
      <div className="mx-auto max-w-4xl grid gap-4 grid-cols-3 grid-rows-3 h-[600px]">
        {sortedItems.map((item, index) => (
        <AnimatedCard 
            key={item.productName}
            item={item} 
            index={index}
            isFirst={false}
          isSecond={false}
          isThird={false}
        />
        ))}
        {/* Заполняем пустые места в сетке 3x3 */}
        {Array.from({ length: 5 }, (_, i) => (
          <div key={`empty-${i}`} className="bg-transparent"></div>
        ))}
      </div>
    </section>
  );
}

// ===== Footer =====
function Footer() {
  return (
    <footer className="mx-auto max-w-6xl py-16 text-sm text-muted-foreground">
      <Separator className="my-8" />
      
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Section */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <span className="font-semibold tracking-tight text-foreground">Limex</span>
          </div>
          <p className="text-sm text-muted-foreground">Built by Quants, For Everyone :)</p>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="https://www.promo.limex.com/careers" className="hover:text-foreground transition-colors">Careers</a></li>
            <li><a href="https://limex.com/tp/info/en/disclaimer/" className="hover:text-foreground transition-colors">Disclaimer</a></li>
            <li><a href="https://2smalls.com/" className="hover:text-foreground transition-colors">Partners</a></li>
            <li><a href="https://limex.com/tp/info/en/privacy-policy/" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="https://limex.com/tp/info/en/cookies-and-trackers/" className="hover:text-foreground transition-colors">Cookies Policy</a></li>
            <li><a href="https://limex.com/tp/info/en/terms-and-conditions/" className="hover:text-foreground transition-colors">Terms and Conditions</a></li>
          </ul>
        </div>

        {/* Products Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Products</h3>
          <ul className="space-y-2">
            <li><a href="https://builder.limex.com" className="hover:text-foreground transition-colors">Alpha Builder</a></li>
            <li><a href="https://ziplime.limex.com/about" className="hover:text-foreground transition-colors">Ziplime</a></li>
            <li><a href="https://beta.limex.com" className="hover:text-foreground transition-colors">Platform</a></li>
            <li><a href="https://www.promo.limex.com/quant_trading" className="hover:text-foreground transition-colors">Quantum</a></li>
            <li><a href="https://challenges.limex.com/" className="hover:text-foreground transition-colors">Challenges</a></li>
            <li><a href="https://limex.com/tp/info/learning_center/" className="hover:text-foreground transition-colors">Education</a></li>
          </ul>
        </div>

        {/* Contacts Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Contacts</h3>
          <div className="space-y-2">
            <p>Lime FinTech, LLC,</p>
            <p>1 Penn Plaza 16th Floor, New York, NY</p>
            <p>Email:</p>
            <a href="mailto:feedback@limex.com" className="hover:text-foreground transition-colors">feedback@limex.com</a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <Separator className="my-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M14.83 14.83a4 4 0 1 1 0-5.66"></path>
          </svg>
          <span>2025 Lime Fintech LLC</span>
        </div>
        
        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a aria-label="Reddit" href="https://www.reddit.com/r/Limex/" className="hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 0-.315.146-.315.315v.63c0 .169.146.315.315.315s.315-.146.315-.315v-.63c0-.169-.146-.315-.315-.315zm-2.52 0c-.169 0-.315.146-.315.315v.63c0 .169.146.315.315.315s.315-.146.315-.315v-.63c0-.169-.146-.315-.315-.315z"/>
            </svg>
          </a>
          <a aria-label="Discord" href="https://discord.com/invite/JGcMsBDHjw" className="hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a aria-label="X/Twitter" href="https://x.com/limexme" className="hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a aria-label="YouTube" href="https://www.youtube.com/@Limexcom" className="hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a aria-label="LinkedIn" href="https://www.linkedin.com/company/limexcom/" className="hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [productScores, setProductScores] = useState<Array<{product: string, points: number, percentage: number}>>([]);
  const [activeScenario, setActiveScenario] = useState<'gold' | 'bitcoin' | 'stock' | null>(null);
  const [showInitialCTAs, setShowInitialCTAs] = useState(true);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  
  // Заголовки с соответствующими сценариями
  const headers = [
    {
      text: "Gold just hit record highs — how can I turn insights like that into real trading experience?",
      scenario: 'gold' as const,
      icon: (
        <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="60" width="15" height="30" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
          <rect x="30" y="45" width="15" height="45" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
          <rect x="50" y="30" width="15" height="60" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
          <rect x="70" y="15" width="15" height="75" fill="#D4AF37" stroke="#B8860B" strokeWidth="2"/>
          <path d="M 17 75 L 37 60 L 57 45 L 77 20 L 90 10" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 85 15 L 90 10 L 95 15" stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      text: "How can I build a crypto strategy that survives FOMO and flash crashes?",
      scenario: 'bitcoin' as const,
      icon: (
        <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#F7931A" stroke="#E07A00" strokeWidth="3"/>
          <text x="50" y="65" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Arial">₿</text>
        </svg>
      )
    }
  ];
  
  // Автоматическая смена заголовков каждые 10 секунд
  useEffect(() => {
    if (!showInitialCTAs) return; // Не меняем, если CTA скрыты
    
    const interval = setInterval(() => {
      setCurrentHeaderIndex((prev) => (prev + 1) % headers.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [showInitialCTAs, headers.length]);
  
  const runScenario = (scenarioType: 'gold' | 'bitcoin' | 'stock') => {
    setActiveScenario(scenarioType);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top-right controls */}
      <Topbar />

      {/* left sidebar */}
      <Sidebar />

      {/* content */}
      <main className="lg:ml-60 ml-0 pr-6">
        <div className="max-w-4xl mx-auto px-3">
          <div className="pt-10 lg:hidden"><Brand /></div>
          
          {/* Кликабельный заголовок с автосменой */}
          {showInitialCTAs && (
            <section className="pt-24 pb-8">
              <div className="mx-auto max-w-4xl text-center px-3">
                <button
                  onClick={() => {
                    setShowInitialCTAs(false);
                    setActiveScenario(headers[currentHeaderIndex].scenario);
                  }}
                  className="group w-full text-center transition-all duration-300 hover:bg-gray-200 rounded-2xl p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-3">
                    {/* Иконка сценария */}
                    {headers[currentHeaderIndex].icon}
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                      {headers[currentHeaderIndex].text}
                    </h1>
                    <ArrowUpRight className="size-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </section>
          )}
          
          <CenterSearch 
            isChatOpen={isChatOpen} 
            setIsChatOpen={setIsChatOpen}
            onSurveyCompleted={setSurveyCompleted}
            onProductScoresChanged={setProductScores}
            onScenarioChange={setActiveScenario}
            activeScenario={activeScenario}
          />
          
          {/* Показываем карточки продуктов всегда под чатом */}
          <FeaturedGrid surveyCompleted={surveyCompleted} productScores={productScores} />
          <Footer />
        </div>
      </main>
    </div>
  );
}

