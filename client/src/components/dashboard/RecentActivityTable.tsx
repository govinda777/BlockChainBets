import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useEvents";
import { formatWalletAddress } from "@/lib/web3";

interface ActivityEntry {
  id: string;
  event: string;
  user: string;
  action: string;
  amount: string;
  time: string;
  status: "Active" | "Completed" | "Ended";
}

const RecentActivityTable: React.FC = () => {
  const { recentActivity, isLoading } = useEvents();

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-primary";
      case "Completed":
        return "bg-green-100 text-secondary";
      case "Ended":
        return "bg-red-100 text-accent";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <Button variant="link" className="p-0 h-auto text-primary text-sm">
            View All
          </Button>
        </div>

        {isLoading ? (
          // Loading state
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : recentActivity.length > 0 ? (
          // Activity table
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Event
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{activity.event}</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {formatWalletAddress(activity.user)}
                    </td>
                    <td className="py-3 px-4">{activity.action}</td>
                    <td className="py-3 px-4 font-medium">{activity.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {activity.time}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`${getStatusBadgeClass(
                          activity.status
                        )} text-xs px-2 py-1 rounded-full`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // No activity
          <div className="text-center py-6">
            <i className="ri-history-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
