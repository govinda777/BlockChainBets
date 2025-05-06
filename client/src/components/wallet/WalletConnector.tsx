import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { getSupportedWallets, WalletInfo } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

const WalletConnector: React.FC = () => {
  const { connect, isConnecting } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const wallets = getSupportedWallets();

  const handleConnectWallet = async (wallet: WalletInfo) => {
    try {
      await connect(wallet);
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${wallet.name}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <button
        className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        onClick={() => setIsOpen(true)}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          "Connect Wallet"
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>
              Connect with your preferred blockchain wallet to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnectWallet(wallet)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group"
                disabled={isConnecting}
              >
                <div className="flex items-center gap-3">
                  <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <i className="ri-arrow-right-line text-gray-400 group-hover:text-primary transition-colors"></i>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnector;
