import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "wouter";
import BetModal from "../events/BetModal";
import CreateEventModal from "../events/CreateEventModal";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/events":
        return "Events";
      case "/my-bets":
        return "My Bets";
      case "/experts":
        return "Experts";
      case "/leaderboard":
        return "Leaderboard";
      case "/create-event":
        return "Create Event";
      default:
        return "OpenLotteryConnect";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
          pageTitle={getPageTitle()}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        {/* Page Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Modals */}
      <BetModal />
      <CreateEventModal />
    </div>
  );
};

export default AppLayout;
