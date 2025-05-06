import React from "react";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: "ri-dashboard-line", label: "Dashboard" },
    { path: "/my-bets", icon: "ri-coin-line", label: "My Bets" },
    { path: "/events", icon: "ri-calendar-event-line", label: "Events" },
    { path: "/experts", icon: "ri-user-star-line", label: "Experts" },
    { path: "/leaderboard", icon: "ri-trophy-line", label: "Leaderboard" },
    { path: "/create-event", icon: "ri-hand-coin-line", label: "Create Event" },
  ];

  // CSS classes for the sidebar container based on open/closed state
  const sidebarClasses = `${
    isOpen ? "fixed inset-0 z-50 block" : "hidden md:flex"
  } flex-col w-64 border-r border-gray-200 bg-white`;

  // Overlay to close sidebar on mobile when clicking outside
  const overlayClasses = `${
    isOpen ? "fixed inset-0 bg-black/50 z-40 md:hidden" : "hidden"
  }`;

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-8">
            <div className="p-2 bg-primary rounded-full">
              <i className="ri-flashlight-line text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              OpenLottery<span className="text-primary">Connect</span>
            </h1>
            
            {/* Close button - only on mobile */}
            <button 
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg md:hidden"
              onClick={onClose}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 px-4 py-8">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-gray-500 hover:text-primary hover:bg-blue-50"
                  } transition-colors`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Become a Creator CTA */}
          <div className="mt-auto px-4 pb-8">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Become a Creator</h3>
              <p className="text-sm text-gray-600 mb-4">Create your own betting events and earn fees.</p>
              <Link href="/create-event">
                <button 
                  className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  onClick={onClose}
                >
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay to close sidebar when clicking outside on mobile */}
      <div className={overlayClasses} onClick={onClose}></div>
    </>
  );
};

export default Sidebar;
