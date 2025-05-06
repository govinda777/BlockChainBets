import React, { useState, useEffect } from "react";
import { useTitle } from "@/hooks/use-title";
import { useEvents } from "@/hooks/useEvents";
import { useWallet } from "@/hooks/useWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WalletConnector from "@/components/wallet/WalletConnector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BetType,
  PLATFORM_FEES,
  MIN_EVENT_CREATION_AMOUNT,
} from "@/lib/constants";

// Validation schema for event creation
const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  liquidityPool: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= MIN_EVENT_CREATION_AMOUNT;
    },
    {
      message: `Minimum liquidity required is ${MIN_EVENT_CREATION_AMOUNT} ETH`,
    }
  ),
  outcomes: z
    .array(
      z.object({
        name: z.string().min(1, "Outcome name is required"),
        odds: z.string().refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 1;
          },
          { message: "Odds must be greater than 1" }
        ),
      })
    )
    .min(2, "At least two outcomes are required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

const CreateEvent: React.FC = () => {
  useTitle("Create Event | OpenLotteryConnect");
  const { createEvent } = useEvents();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [eventType, setEventType] = useState("sports");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up the form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      category: BetType.SPORTS,
      subcategory: "",
      description: "",
      startDate: "",
      startTime: "",
      liquidityPool: "0.5",
      outcomes: [
        { name: "", odds: "" },
        { name: "", odds: "" },
      ],
    },
  });

  // Get current form values for calculations
  const { liquidityPool } = form.watch();
  
  // Calculate platform fee
  const platformFee = parseFloat(liquidityPool || "0") * PLATFORM_FEES.eventCreationFee;

  // Add an outcome field to the form
  const addOutcome = () => {
    const outcomes = form.getValues("outcomes");
    form.setValue("outcomes", [...outcomes, { name: "", odds: "" }]);
  };

  // Remove an outcome field from the form
  const removeOutcome = (index: number) => {
    const outcomes = form.getValues("outcomes");
    if (outcomes.length <= 2) {
      toast({
        title: "Cannot remove outcome",
        description: "At least two outcomes are required",
        variant: "destructive",
      });
      return;
    }
    form.setValue(
      "outcomes",
      outcomes.filter((_, i) => i !== index)
    );
  };

  // Form submission handler
  const onSubmit = async (data: EventFormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an event",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate that the start date is in the future
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      if (startDateTime <= new Date()) {
        toast({
          title: "Invalid date/time",
          description: "Event must start in the future",
          variant: "destructive",
        });
        return;
      }

      // Prepare outcomes with parsed odds
      const outcomes = data.outcomes.map((outcome) => ({
        name: outcome.name,
        odds: parseFloat(outcome.odds),
      }));

      // Call the context method to create the event
      await createEvent({
        title: data.title,
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        startDate: startDateTime.toISOString(),
        liquidityPool: parseFloat(data.liquidityPool),
        outcomes,
      });

      toast({
        title: "Event created successfully",
        description: "Your betting event has been created",
      });

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Failed to create event",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default event type based on selected category
  useEffect(() => {
    const category = form.watch("category");
    setEventType(category.toLowerCase());
  }, [form.watch("category")]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="ri-wallet-3-line text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Connect your wallet to create betting events and earn fees as a creator.
        </p>
        <div className="w-64">
          <WalletConnector />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Create Betting Event</h1>

      <Tabs value={eventType} onValueChange={setEventType}>
        <TabsList className="mb-4">
          <TabsTrigger value="sports">Sports Event</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Price Prediction</TabsTrigger>
          <TabsTrigger value="politics">Political Event</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={eventType} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Create a {eventType} betting event</CardTitle>
              <CardDescription>
                Fill in the details below to create your betting event. You'll need to provide
                initial liquidity to create the event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Event Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={
                              eventType === "sports" 
                                ? "e.g., Liverpool vs Chelsea" 
                                : eventType === "crypto"
                                ? "e.g., Bitcoin > $80,000 by EOY"
                                : "e.g., 2024 Presidential Election Winner"
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setEventType(value.toLowerCase());
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={BetType.SPORTS}>Sports</SelectItem>
                            <SelectItem value={BetType.CRYPTO}>Crypto</SelectItem>
                            <SelectItem value={BetType.POLITICS}>Politics</SelectItem>
                            <SelectItem value={BetType.ENTERTAINMENT}>Entertainment</SelectItem>
                            <SelectItem value={BetType.OTHER}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory */}
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={
                              eventType === "sports" 
                                ? "e.g., Premier League, NBA, NFL" 
                                : eventType === "crypto"
                                ? "e.g., Bitcoin Price, Ethereum TVL"
                                : "e.g., US Election, Oscar Awards"
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Date/Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the details of your event..."
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Outcomes */}
                  <div>
                    <FormLabel className="block mb-2">Outcome Options</FormLabel>
                    {form.getValues("outcomes").map((_, index) => (
                      <div key={index} className="flex gap-4 mb-2">
                        <FormField
                          control={form.control}
                          name={`outcomes.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Option ${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`outcomes.${index}.odds`}
                          render={({ field }) => (
                            <FormItem className="w-24">
                              <FormControl>
                                <Input placeholder="Odds" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOutcome(index)}
                          className="self-start"
                        >
                          <i className="ri-delete-bin-line text-accent"></i>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOutcome}
                      className="mt-2 flex items-center gap-1"
                    >
                      <i className="ri-add-line"></i>
                      Add Another Option
                    </Button>
                  </div>

                  {/* Liquidity Pool */}
                  <FormField
                    control={form.control}
                    name="liquidityPool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Liquidity Pool</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              className="pr-16"
                            />
                          </FormControl>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <img
                              src="https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png"
                              alt="ETH"
                              className="w-5 h-5"
                            />
                            <span className="font-medium">ETH</span>
                          </div>
                        </div>
                        <FormDescription>
                          Minimum {MIN_EVENT_CREATION_AMOUNT} ETH to create an event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fee Display */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Platform Fee (1%)</span>
                      <span className="font-medium">{platformFee.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Creator Fee (1% of all bets)</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Creating Event...
                      </span>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateEvent;
