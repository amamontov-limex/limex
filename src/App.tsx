import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";
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
function CenterSearch({ isChatOpen, setIsChatOpen }: { isChatOpen: boolean; setIsChatOpen: (open: boolean) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'bot', isThinking?: boolean}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessages, setShowMessages] = useState(false);
  
  const chips = ["Create trading profile", "What about my portfolio?", "Research", "Challenges", "Products"];
  
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

  const handleChipClick = (chipText: string) => {
    console.log('🔘 Chip clicked:', chipText);
    setIsChatOpen(true);
    
    // Add user message
    const userMessage = { id: 1, text: chipText, sender: 'user' as const };
    setMessages([userMessage]);
    
    // Add "AI is thinking" message
    const thinkingMessage = { id: 2, text: "AI is thinking...", sender: 'bot' as const, isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);
    
    // Send to OpenAI
    const openAIMessages = [
      { role: 'user' as const, content: chipText }
    ];
    
    sendMessageToOpenAI(openAIMessages)
      .then((botResponse) => {
        // Remove thinking message and add real response
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        const botMessage = { id: 2, text: botResponse, sender: 'bot' as const };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch((error) => {
        console.error('Error getting AI response:', error);
        // Remove thinking message and add error
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        const errorMessage = { id: 2, text: "Sorry, there was an error processing your request. Please try again.", sender: 'bot' as const };
        setMessages(prev => [...prev, errorMessage]);
      });
  };

  const handleSendMessage = () => {
    console.log('🚀 handleSendMessage called!');
    console.log('📝 newMessage:', newMessage);
    console.log('📝 newMessage.trim():', newMessage.trim());
    
    if (newMessage.trim()) {
      const userMessage = { id: messages.length + 1, text: newMessage, sender: 'user' as const };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");
      
      // Add "AI is thinking" message
      const thinkingMessage = { id: messages.length + 2, text: "AI is thinking...", sender: 'bot' as const, isThinking: true };
      setMessages(prev => [...prev, thinkingMessage]);
      
      // Prepare messages for OpenAI
      const openAIMessages = [
        { role: 'user' as const, content: newMessage }
      ];
      
      // Get response from OpenAI
      sendMessageToOpenAI(openAIMessages)
        .then((botResponse) => {
          // Remove thinking message and add real response
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const botMessage = { id: messages.length + 2, text: botResponse, sender: 'bot' as const };
          setMessages(prev => [...prev, botMessage]);
        })
        .catch((error) => {
          console.error('Error getting AI response:', error);
          // Remove thinking message and add error
          setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
          const errorMessage = { id: messages.length + 2, text: "Sorry, there was an error processing your request. Please try again.", sender: 'bot' as const };
          setMessages(prev => [...prev, errorMessage]);
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

  return (
    <section className="pt-24">
      <div className="mx-auto max-w-3xl text-center px-3">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Create your investment profile</h1>
        
        {/* Chat Container - фиксированная высота 520px */}
        <div className="h-[520px] flex flex-col">
          {/* Messages */}
          {isChatOpen && (
            <div className="flex-1 overflow-y-auto px-3 py-4">
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
                    <div className="max-w-[80%]">
                      <div className={`px-4 py-3 ${
                        message.sender === 'user' 
                          ? 'bg-gray-100 text-gray-900 rounded-2xl text-right' 
                          : 'text-gray-900 text-left'
                      }`}>
                        {message.isThinking ? (
                          <div className="flex items-center gap-2">
                            <span>{message.text}</span>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Interface - всегда внизу */}
          <div className={`transition-all duration-[2000ms] ease-out ${
            isChatOpen ? 'mt-0' : 'mt-auto'
          }`}>
          <div className="flex items-center rounded-2xl border bg-background px-4 py-3 shadow-sm">
            <Input
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              placeholder={isChatOpen ? "Type your message..." : "What is your investment goal?"}
              aria-label="Ask Limex"
              value={isChatOpen ? newMessage : searchValue}
              onChange={(e) => isChatOpen ? setNewMessage(e.target.value) : setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (isChatOpen ? handleSendMessage() : handleKeyPress(e))}
            />
            <Button 
              size="icon" 
              className={`ml-2 rounded-xl transition-colors ${
                (isChatOpen ? newMessage.trim() : searchValue.trim())
                  ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Go"
              onClick={() => {
                console.log('🔘 Button clicked!');
                console.log('🔘 isChatOpen:', isChatOpen);
                console.log('🔘 newMessage:', newMessage);
                console.log('🔘 searchValue:', searchValue);
                if (isChatOpen) {
                  console.log('🔘 Calling handleSendMessage');
                  handleSendMessage();
                } else {
                  console.log('🔘 Calling handleSearch');
                  handleSearch();
                }
              }}
              disabled={!(isChatOpen ? newMessage.trim() : searchValue.trim())}
            >
              <ArrowUpRight className="size-5" />
            </Button>
          </div>
          {!isChatOpen && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {chips.map((c, index) => (
                <Badge 
                  key={c} 
                  variant="secondary" 
                  className={`rounded-full px-3 py-1 text-xs cursor-pointer transition-all duration-200 hover:scale-105 ${
                    index === 0 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'hover:bg-gray-300'
                  }`}
                  onClick={() => handleChipClick(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
      
    </section>
  );
}

// ===== Featured Grid =====
function FeaturedGrid() {
  const items = [
    {
      title: "Platform",
      desc: "Best instruments for traders in one platform",
      link: "https://beta.limex.com",
    },
    {
      title: "Challenges",
      desc: "For quants, algo traders and researchers",
      link: "https://challenges.limex.com",
    },
    {
      title: "Research",
      desc: "Backtest your ideas with Ziplime",
      link: null, // Coming soon
    },
    {
      title: "Traders Journal",
      desc: "Your trading thoughts and more",
      link: null, // No link specified
    },
    {
      title: "Alpha Builder",
      desc: "Intelligent stock selection and portfolio optimization",
      link: "https://builder.limex.com",
    },
    {
      title: "ZipLime",
      desc: "The legendary backtester — no setup needed.",
      link: "https://ziplime.limex.com",
    },
  ];

  const handleCardClick = (link: string | null) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <section className="mt-6 px-3">
      <div className="mx-auto max-w-6xl grid gap-4 md:grid-cols-3">
        <Card 
          className="md:col-span-2 rounded-3xl overflow-hidden h-[340px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
          onClick={() => handleCardClick(items[0].link)}
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img 
              src="/images/abstract-representation-of-a-digital-copilot-in-a-.png" 
              alt="Platform" 
              className="w-full h-full object-cover filter blur-[7px] brightness-75 group-hover:blur-[3px] group-hover:brightness-90 transition-all duration-500"
            />
          </div>
          
          {/* Content Overlay */}
          <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-5xl font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                AI instruments
              </div>
            </div>
          </CardContent>
          
          {/* Description */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-white drop-shadow-lg font-medium">{items[0].desc}</p>
          </div>
        </Card>
        
        <Card 
          className="rounded-3xl overflow-hidden h-[340px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
          onClick={() => handleCardClick(items[1].link)}
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img 
              src="/images/golden-race-cup-big-around-it-lines-like-orbits-wi.png" 
              alt="Challenges" 
              className="w-full h-full object-cover filter blur-[7px] brightness-75 group-hover:blur-[3px] group-hover:brightness-90 transition-all duration-500"
            />
          </div>
          
          {/* Content Overlay */}
          <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                {items[1].title}
              </div>
            </div>
          </CardContent>
          
          {/* Description */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-white drop-shadow-lg font-medium">{items[1].desc}</p>
          </div>
        </Card>
        
        <Card 
          className="rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
          onClick={() => window.open('https://www.promo.limex.com/quantum_course', '_blank')}
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img 
              src="/images/abstract-visualization-of-algorithmic-intelligence (1).png" 
              alt="Education" 
              className="w-full h-full object-cover filter blur-[7px] brightness-75 group-hover:blur-[3px] group-hover:brightness-90 transition-all duration-500"
            />
          </div>
          
          {/* Content Overlay */}
          <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-xl font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                Education
              </div>
            </div>
          </CardContent>
          
          {/* Description */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-white drop-shadow-lg font-medium">{items[2].desc}</p>
          </div>
        </Card>
        
        <Card 
          className="md:col-span-2 rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img 
              src="/images/traders-book-has-writing-in-it-and-data-on-the-cen.png" 
              alt="Traders Journal" 
              className="w-full h-full object-cover filter blur-[7px] brightness-75 group-hover:blur-[3px] group-hover:brightness-90 transition-all duration-500"
            />
          </div>
          
          {/* Content Overlay */}
          <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-xl font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                {items[3].title}
              </div>
            </div>
          </CardContent>
          
          {/* Description */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-white drop-shadow-lg font-medium">{items[3].desc}</p>
          </div>
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
            <div className="text-3xl font-bold text-white drop-shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              Coming Soon
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col gap-4">
          <Card 
            className="rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
            onClick={() => handleCardClick(items[5].link)}
          >
            <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
              <div className="text-center">
                <div className="text-xl font-semibold tracking-tight text-gray-900 group-hover:scale-105 transition-transform duration-300">
                  {items[5].title}
                </div>
              </div>
            </CardContent>
            
            {/* Description */}
            <div className="absolute bottom-6 left-6 z-10">
              <p className="text-gray-700 font-medium">{items[5].desc}</p>
            </div>
          </Card>
          
          <Card 
            className="rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer hover:bg-gray-200 transition-all duration-300 group"
            onClick={() => handleCardClick(items[4].link)}
          >
            <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
              <div className="text-center">
                <div className="text-xl font-semibold tracking-tight text-gray-900 group-hover:scale-105 transition-transform duration-300">
                  {items[4].title}
                </div>
              </div>
            </CardContent>
            
            {/* Description */}
            <div className="absolute bottom-6 left-6 z-10">
              <p className="text-gray-700 font-medium">{items[4].desc}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ===== Footer =====
function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-3 py-16 text-sm text-muted-foreground">
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
            <li><a href="https://copilot.limex.com" className="hover:text-foreground transition-colors">Copilot</a></li>
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
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top-right controls */}
      <Topbar />

      {/* left sidebar */}
      <Sidebar />

      {/* content */}
      <main className="mx-auto max-w-[980px]">
        <div className="pt-10 lg:hidden px-3"><Brand /></div>
        <CenterSearch isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
        <FeaturedGrid />
        <Footer />
      </main>
    </div>
  );
}
