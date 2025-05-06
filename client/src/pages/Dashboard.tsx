import React, { useEffect } from "react";
import { useTitle } from "@/hooks/use-title";
import { useWallet } from "@/hooks/useWallet";
import { useEvents } from "@/hooks/useEvents";
import { useBets } from "@/hooks/useBets";
import BalanceCard from "@/components/dashboard/BalanceCard";
import ActiveBetsCard from "@/components/dashboard/ActiveBetsCard";
import ExpertPicksCard from "@/components/dashboard/ExpertPicksCard";
import EventCard from "@/components/events/EventCard";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import WalletConnector from "@/components/wallet/WalletConnector";

const Dashboard: React.FC = () => {
  useTitle("Dashboard | OpenLotteryConnect");
  const { isConnected } = useWallet();
  const { featuredEvents, fetchFeaturedEvents } = useEvents();

  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section with cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BalanceCard />
        <ActiveBetsCard />
        <ExpertPicksCard />
      </div>

      {/* Featured Events Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Events</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm font-medium bg-white px-3 py-2 rounded-lg shadow-sm">
              <i className="ri-filter-3-line"></i>
              Filter
            </button>
            <button className="flex items-center gap-1 text-sm font-medium bg-white px-3 py-2 rounded-lg shadow-sm">
              <i className="ri-sort-desc"></i>
              Sort
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Connect Wallet Section - Only show if not connected */}
      {!isConnected && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-6">
            Connect with your preferred blockchain wallet to get started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-metamask-2728406-2261817.png"
                  alt="MetaMask"
                  className="w-8 h-8"
                />
                <span className="font-medium">MetaMask</span>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-primary transition-colors"></i>
            </button>

            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <img
                  src="https://repository-images.githubusercontent.com/231273290/a4f95000-39e9-11eb-83c2-d1dda50f3539"
                  alt="WalletConnect"
                  className="w-8 h-8"
                />
                <span className="font-medium">WalletConnect</span>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-primary transition-colors"></i>
            </button>

            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <img
                  src="https://phantom.app/apple-touch-icon.png"
                  alt="Phantom"
                  className="w-8 h-8"
                />
                <span className="font-medium">Phantom</span>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-primary transition-colors"></i>
            </button>

            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <img
                  src="https://play-lh.googleusercontent.com/RdM0LZ1GyV3VFR6u8g2evEBHZvvSPYTJrY6OPdHRKIzYzBz_d8xBznT_NNjdJXL9XdI"
                  alt="Exodus"
                  className="w-8 h-8"
                />
                <span className="font-medium">Exodus</span>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-primary transition-colors"></i>
            </button>
          </div>
        </div>
      )}

      {/* Statistics and Leaderboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatisticsCard />
        <LeaderboardCard />
      </div>

      {/* Recent Activity Section */}
      <RecentActivityTable />
    </div>
  );
};

export default Dashboard;
