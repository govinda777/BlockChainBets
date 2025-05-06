import React, { useEffect, useState } from "react";
import { useTitle } from "@/hooks/use-title";
import { useEvents } from "@/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Leaderboard: React.FC = () => {
  useTitle("Leaderboard | OpenLotteryConnect");
  const { leaderboard, isLoading, fetchExperts } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("allTime");
  const [category, setCategory] = useState("all");

  // Extended leaderboard for this page (more entries than dashboard preview)
  const extendedLeaderboard = [
    ...leaderboard,
    {
      rank: 5,
      id: "5",
      name: "FutureTeller",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      successRate: "90.5%",
      profit: "+521 ETH",
    },
    {
      rank: 6,
      id: "6",
      name: "OddsWizard",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79",
      successRate: "89.7%",
      profit: "+489 ETH",
    },
    {
      rank: 7,
      id: "7",
      name: "PredictionPro",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
      successRate: "87.3%",
      profit: "+412 ETH",
    },
    {
      rank: 8,
      id: "8",
      name: "CoinOracle",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      successRate: "85.9%",
      profit: "+378 ETH",
    },
    {
      rank: 9,
      id: "9",
      name: "SportsGuru",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      successRate: "84.2%",
      profit: "+356 ETH",
    },
    {
      rank: 10,
      id: "10",
      name: "BetMaster",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      successRate: "82.0%",
      profit: "+301 ETH",
    },
  ];

  // Filter leaderboard based on search and filters
  const filteredLeaderboard = extendedLeaderboard.filter((entry) => {
    // Filter by search query
    if (searchQuery && !entry.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Predictor Leaderboard</h1>
        
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search predictors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <Tabs
          defaultValue="all"
          value={category}
          onValueChange={setCategory}
        >
          <TabsList>
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="politics">Politics</TabsTrigger>
            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard Card */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            // Loading state
            <Skeleton className="h-96 w-full" />
          ) : filteredLeaderboard.length > 0 ? (
            // Leaderboard table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Rank</TableHead>
                    <TableHead>Predictor</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Total Bets</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono font-medium">
                        {entry.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-xs text-gray-500">Member since 2023</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-secondary" 
                              style={{ 
                                width: entry.successRate.replace('%', '') + '%' 
                              }}
                            ></div>
                          </div>
                          <span>{entry.successRate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Math.floor(Math.random() * 300) + 100}
                      </TableCell>
                      <TableCell className="font-mono font-medium text-secondary">
                        {entry.profit}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // No results
            <div className="text-center py-20">
              <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-gray-500">
                Try changing your search criteria or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Top Categories</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Crypto</span>
                  <span>37%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '37%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Sports</span>
                  <span>32%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '32%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Politics</span>
                  <span>18%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-warning" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Entertainment</span>
                  <span>13%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '13%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Total Platform Volume</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold">5,372 ETH</p>
                <p className="text-sm text-secondary flex items-center gap-1">
                  <i className="ri-arrow-up-line"></i>
                  +12.5% from last month
                </p>
              </div>
              <div className="text-5xl text-gray-200">
                <i className="ri-exchange-dollar-line"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-xl font-semibold">12,845</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Bets</p>
                <p className="text-xl font-semibold">23,498</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Active Events</p>
                <p className="text-xl font-semibold">453</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Win Rate Avg</p>
                <p className="text-xl font-semibold">48.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
