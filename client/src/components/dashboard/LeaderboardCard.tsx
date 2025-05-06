import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  successRate: string;
  profit: string;
}

const LeaderboardCard: React.FC = () => {
  const { leaderboard, isLoading } = useEvents();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Top Predictors</h3>
          <Link href="/leaderboard">
            <Button variant="link" className="p-0 h-auto text-primary text-sm">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          // Loading state
          <div className="flex flex-col divide-y">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          // Leaderboard entries
          <div className="flex flex-col divide-y">
            {leaderboard.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 py-3">
                <span className="font-mono font-medium w-6 text-center">
                  {entry.rank}
                </span>
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-xs text-gray-500">{entry.successRate} success rate</p>
                </div>
                <p className="font-mono font-medium text-secondary">
                  {entry.profit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // No leaderboard data
          <div className="text-center py-6">
            <i className="ri-trophy-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500">
              No leaderboard data available yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
