import React, { useState, useEffect } from "react";
import { useTitle } from "@/hooks/use-title";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/events/EventCard";
import { BetType } from "@/lib/constants";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const Events: React.FC = () => {
  useTitle("Events | OpenLotteryConnect");
  const { allEvents, fetchEvents, isLoading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("latest");
  
  // Filtered events based on search, category, and sort
  const filteredEvents = allEvents
    .filter((event) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.subcategory.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((event) => {
      // Filter by category
      if (selectedCategory !== "all") {
        return event.category === selectedCategory;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected order
      if (sortOrder === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "endingSoon") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortOrder === "highestOdds") {
        const maxOddsA = Math.max(...a.outcomes.map(o => o.odds));
        const maxOddsB = Math.max(...b.outcomes.map(o => o.odds));
        return maxOddsB - maxOddsA;
      }
      return 0;
    });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Betting Events</h1>
        
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value={BetType.SPORTS}>Sports</TabsTrigger>
          <TabsTrigger value={BetType.CRYPTO}>Crypto</TabsTrigger>
          <TabsTrigger value={BetType.POLITICS}>Politics</TabsTrigger>
          <TabsTrigger value={BetType.ENTERTAINMENT}>Entertainment</TabsTrigger>
        </TabsList>
        
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>
          
          <div className="flex gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Added</SelectItem>
                <SelectItem value="endingSoon">Ending Soon</SelectItem>
                <SelectItem value="highestOdds">Highest Odds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Events Grid */}
        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            // No events found
            <div className="text-center py-20">
              <i className="ri-calendar-event-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500">
                Try changing your search criteria or check back later for new events.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
