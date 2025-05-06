import React from "react";
import { useBets } from "@/hooks/useBets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, EventOutcome } from "@/contexts/EventsContext";
import { EventStatus } from "@/lib/constants";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { openBetModal } = useBets();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const getTimeRemaining = () => {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    const diff = eventDate.getTime() - now.getTime();

    // If event has passed
    if (diff < 0) {
      if (event.status === EventStatus.ACTIVE) {
        return "In Progress";
      }
      return `Ended ${new Date(event.endDate).toLocaleDateString()}`;
    }

    // Calculate days, hours, and minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `Starts in ${days}d ${hours}h`;
    } else if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    } else {
      return `Starts in ${minutes}m`;
    }
  };

  // Get category badge color
  const getCategoryBadgeClass = () => {
    switch (event.category) {
      case "Sports":
        return "bg-primary/80";
      case "Crypto":
        return "bg-warning/80";
      case "Politics":
        return "bg-accent/80";
      case "Entertainment":
        return "bg-secondary/80";
      default:
        return "bg-gray-500/80";
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-40 bg-gray-100 relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className={`text-xs text-white ${getCategoryBadgeClass()} px-2 py-1 rounded-full`}>
            {event.category}
          </span>
          <h3 className="text-white font-medium mt-2">{event.subcategory}</h3>
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{event.title}</h3>
          <span className="text-xs text-gray-500">{getTimeRemaining()}</span>
        </div>
        <div className="flex gap-2 mb-4">
          {event.outcomes.map((outcome) => (
            <div key={outcome.id} className="flex-1 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">{outcome.name}</p>
              <p className="odds-badge bg-blue-100 text-primary inline-block">
                {outcome.odds.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            className="flex-1"
            onClick={() => openBetModal(event)}
            disabled={event.status !== EventStatus.ACTIVE && event.status !== EventStatus.UPCOMING}
          >
            Place Bet
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2"
          >
            <i className={`${isFavorite ? "ri-star-fill text-warning" : "ri-star-line"}`}></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
