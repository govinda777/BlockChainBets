import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const StatisticsCard: React.FC = () => {
  const { platformStats, isLoading } = useEvents();

  const stats = [
    {
      label: "Total Bets",
      value: platformStats?.totalBets || 0,
      bg: "bg-blue-50",
    },
    {
      label: "Total Volume",
      value: `${platformStats?.totalVolume || 0} ETH`,
      bg: "bg-green-50",
    },
    {
      label: "Active Events",
      value: platformStats?.activeEvents || 0,
      bg: "bg-yellow-50",
    },
    {
      label: "Active Users",
      value: platformStats?.activeUsers || 0,
      bg: "bg-red-50",
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Platform Statistics</h3>
        
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          // Stats grid
          <div className="grid grid-cols-2 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className={`p-4 ${stat.bg} rounded-lg`}>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          className="w-full text-primary border-primary"
        >
          View Detailed Stats
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
