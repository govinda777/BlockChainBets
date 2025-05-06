import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import ConnectedWallet from "../wallet/ConnectedWallet";

interface HeaderProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { wallet, isConnected } = useWallet();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left side - Mobile menu toggle and page title */}
      <div className="flex items-center gap-4">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          onClick={onMenuToggle}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <h1 className="text-lg font-semibold hidden sm:block">{pageTitle}</h1>
      </div>
      
      {/* Middle - Search bar */}
      <div className="md:flex items-center bg-gray-100 rounded-lg px-4 py-2 gap-2 hidden">
        <i className="ri-search-line text-gray-500"></i>
        <input 
          type="text" 
          placeholder="Search events, teams, experts..." 
          className="bg-transparent border-none outline-none text-sm w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Right side - Wallet and notifications */}
      <div className="flex items-center gap-2">
        {/* Connected wallet display or connect button */}
        <ConnectedWallet />
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
          </button>
          
          {/* Notifications dropdown (simplified for MVP) */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-2 z-50 border border-gray-200">
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <h3 className="font-semibold">Notifications</h3>
                <button 
                  className="text-xs text-primary"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  Mark all as read
                </button>
              </div>
              <div className="py-2">
                <p className="text-sm text-gray-500 text-center">No new notifications</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
