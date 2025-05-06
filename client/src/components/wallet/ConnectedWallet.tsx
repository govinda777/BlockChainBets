import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import WalletConnector from "./WalletConnector";
import { formatWalletAddress } from "@/lib/web3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const ConnectedWallet: React.FC = () => {
  const { wallet, disconnect, isConnected } = useWallet();
  const { toast } = useToast();

  if (!isConnected) {
    return <WalletConnector />;
  }

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 transition-colors py-2 px-4 rounded-xl">
          <img src={wallet?.icon} alt={wallet?.name} className="w-5 h-5" />
          <span className="font-mono text-sm font-medium truncate-address">
            {formatWalletAddress(wallet?.address || "")}
          </span>
          <i className="ri-arrow-down-s-line"></i>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col p-2">
          <p className="text-sm font-medium">Connected to {wallet?.name}</p>
          <p className="text-xs text-gray-500 font-mono truncate">
            {wallet?.address}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <i className="ri-wallet-3-line"></i>
          <span>Balance: {wallet?.balance} ETH</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <i className="ri-exchange-dollar-line"></i>
          <span>Deposit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <i className="ri-cash-line"></i>
          <span>Withdraw</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <i className="ri-file-list-3-line"></i>
          <span>Transaction History</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive"
          onClick={handleDisconnect}
        >
          <i className="ri-logout-box-r-line"></i>
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedWallet;
