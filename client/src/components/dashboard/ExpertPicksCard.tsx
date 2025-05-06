import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";

interface Expert {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  latestPick: string;
  timeAgo: string;
  isFollowing: boolean;
}

const ExpertPicksCard: React.FC = () => {
  const { topExperts, isLoading, followExpert } = useEvents();

  const handleFollow = (expertId: string, isFollowing: boolean) => {
    followExpert(expertId, !isFollowing);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-500 font-medium">Top Expert Picks</h3>
          <Link href="/experts">
            <Button variant="link" className="p-0 h-auto text-primary text-sm">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          // Loading state
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ) : topExperts.length > 0 ? (
          // Expert list
          <div className="flex flex-col gap-3">
            {topExperts.map((expert) => (
              <div
                key={expert.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium">{expert.name}</p>
                    <span className="bg-secondary/20 text-secondary text-xs px-1 py-0.5 rounded-full">
                      {expert.winRate}% Win
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {expert.latestPick} • {expert.timeAgo}
                  </p>
                </div>
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => handleFollow(expert.id, expert.isFollowing)}
                >
                  {expert.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // No experts
          <div className="text-center py-6">
            <i className="ri-user-star-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500">No expert picks available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertPicksCard;
