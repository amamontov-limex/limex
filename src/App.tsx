import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";

// ===== Brand =====
function Brand() {
  return (
    <a href="#" className="inline-flex items-center gap-2">
      <span className="font-semibold tracking-tight">Limex</span>
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
function CenterSearch() {
  const [searchValue, setSearchValue] = useState("");
  
  const chips = ["What do you have?", "What about my portfolio?", "Research", "Challenges", "More"];
  
  const handleSearch = () => {
    if (searchValue.trim()) {
      window.open('https://beta.limex.com', '_blank');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChipClick = (chipText: string) => {
    setSearchValue(chipText);
  };

  return (
    <section className="pt-24">
      <div className="mx-auto max-w-3xl text-center px-3">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Create first trading strategy</h1>
        <div className="mt-6 flex items-center rounded-2xl border bg-background px-4 py-3 shadow-sm">
          <Input
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            placeholder="I want to create conservative portfolio"
            aria-label="Ask Limex"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            size="icon" 
            className={`ml-2 rounded-xl transition-colors ${
              searchValue.trim() 
                ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Go"
            onClick={handleSearch}
            disabled={!searchValue.trim()}
          >
            <ArrowUpRight className="size-5" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {chips.map((c) => (
            <Badge 
              key={c} 
              variant="secondary" 
              className="rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={() => handleChipClick(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Featured Grid =====
function FeaturedGrid() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
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
  ];

  const handleCardClick = (link: string | null) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <section className="mt-20 px-3">
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
              className="w-full h-full object-cover filter blur-[7px] group-hover:blur-[3px] transition-all duration-500"
            />
          </div>
          
          {/* Content Overlay */}
          <CardContent className="p-6 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              <div className="text-5xl font-semibold tracking-tight text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                {items[0].title}
              </div>
            </div>
          </CardContent>
          
          {/* Description */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-white drop-shadow-lg font-medium">{items[0].desc}</p>
          </div>
        </Card>
        
        <Card 
          className="rounded-3xl overflow-hidden h-[340px] bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleCardClick(items[1].link)}
        >
          <CardContent className="p-6 h-full flex items-end">
            <div>
              <div className="text-2xl font-semibold tracking-tight">{items[1].title}</div>
              <p className="text-muted-foreground">{items[1].desc}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer transition-all duration-300 ease-out ${
            hoveredCard === 'research' 
              ? 'transform scale-105 shadow-xl' 
              : 'transform scale-100 shadow-sm'
          }`}
          onMouseEnter={() => setHoveredCard('research')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardContent className="p-6 h-full flex items-end">
            <div>
              <div className="text-xl font-semibold tracking-tight">{items[2].title}</div>
              <p className="text-muted-foreground">{items[2].desc}</p>
            </div>
          </CardContent>
          <div className={`absolute inset-0 bg-gray-100/90 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ease-out ${
            hoveredCard === 'research' 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}>
            <div className={`text-2xl font-semibold text-gray-600 transition-all duration-500 ease-out ${
              hoveredCard === 'research' 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}>
              Coming soon
            </div>
          </div>
        </Card>
        
        <Card 
          className={`md:col-span-2 rounded-3xl overflow-hidden h-[260px] bg-gray-100 relative cursor-pointer transition-all duration-300 ease-out ${
            hoveredCard === 'traders-journal' 
              ? 'transform scale-105 shadow-xl' 
              : 'transform scale-100 shadow-sm'
          }`}
          onMouseEnter={() => setHoveredCard('traders-journal')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardContent className="p-6 h-full flex items-end">
            <div>
              <div className="text-xl font-semibold tracking-tight">{items[3].title}</div>
              <p className="text-muted-foreground">{items[3].desc}</p>
            </div>
          </CardContent>
          <div className={`absolute inset-0 bg-gray-100/90 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ease-out ${
            hoveredCard === 'traders-journal' 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}>
            <div className={`text-2xl font-semibold text-gray-600 transition-all duration-500 ease-out ${
              hoveredCard === 'traders-journal' 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}>
              Coming soon
            </div>
          </div>
        </Card>
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top-right controls */}
      <Topbar />

      {/* left sidebar */}
      <Sidebar />

      {/* content */}
      <main className="mx-auto max-w-[980px]">
        <div className="pt-10 lg:hidden px-3"><Brand /></div>
        <CenterSearch />
        <FeaturedGrid />
        <Footer />
      </main>
    </div>
  );
}
