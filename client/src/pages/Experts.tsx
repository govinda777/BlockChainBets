import React, { useEffect, useState } from "react";
import { useTitle } from "@/hooks/use-title";
import { useEvents } from "@/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpertProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
  winRate: number;
  totalPredictions: number;
  profit: string;
  isFollowing: boolean;
  latestPicks: Array<{
    id: string;
    event: string;
    prediction: string;
    date: string;
    result: "Pending" | "Won" | "Lost";
  }>;
}

const Experts: React.FC = () => {
  useTitle("Experts | OpenLotteryConnect");
  const { allExperts, isLoading, fetchExperts, followExpert } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [sortOrder, setSortOrder] = useState("winRate");

  // Filtered experts based on search, specialty, and sort
  const filteredExperts = allExperts
    .filter((expert) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          expert.name.toLowerCase().includes(query) ||
          expert.specialty.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((expert) => {
      // Filter by specialty
      if (specialty !== "all") {
        return expert.specialty === specialty;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected order
      if (sortOrder === "winRate") {
        return b.winRate - a.winRate;
      } else if (sortOrder === "mostPredictions") {
        return b.totalPredictions - a.totalPredictions;
      } else if (sortOrder === "highestProfit") {
        return parseFloat(b.profit) - parseFloat(a.profit);
      }
      return 0;
    });

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const handleFollowExpert = (expertId: string, isFollowing: boolean) => {
    followExpert(expertId, !isFollowing);
  };

  const specialties = [
    "all",
    "Sports",
    "Crypto",
    "Politics",
    "Entertainment",
    "General",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Betting Experts</h1>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search experts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <Tabs
          defaultValue="all"
          value={specialty}
          onValueChange={setSpecialty}
        >
          <TabsList>
            {specialties.map((s) => (
              <TabsTrigger key={s} value={s}>
                {s === "all" ? "All Specialties" : s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="winRate">Highest Win Rate</SelectItem>
            <SelectItem value="mostPredictions">Most Predictions</SelectItem>
            <SelectItem value="highestProfit">Highest Profit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Experts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExperts.map((expert) => (
            <Card key={expert.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
                        <p className="text-sm text-gray-500">
                          {expert.specialty} Expert
                        </p>
                      </div>
                      <Button
                        variant={expert.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() =>
                          handleFollowExpert(expert.id, expert.isFollowing)
                        }
                      >
                        {expert.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                    <p className="text-sm mt-2">{expert.bio}</p>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Win Rate</p>
                        <p className="font-semibold">{expert.winRate}%</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Predictions</p>
                        <p className="font-semibold">
                          {expert.totalPredictions}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="font-semibold">{expert.profit}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Picks */}
                {expert.latestPicks && expert.latestPicks.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Latest Picks</h4>
                    <div className="flex flex-col gap-2">
                      {expert.latestPicks.map((pick) => (
                        <div
                          key={pick.id}
                          className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{pick.event}</p>
                            <p className="text-xs text-gray-500">
                              {pick.prediction} • {pick.date}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              pick.result === "Won"
                                ? "bg-green-100 text-secondary"
                                : pick.result === "Lost"
                                ? "bg-red-100 text-accent"
                                : "bg-blue-100 text-primary"
                            }`}
                          >
                            {pick.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <i className="ri-user-search-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-medium mb-2">No experts found</h3>
          <p className="text-gray-500">
            Try changing your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Experts;
