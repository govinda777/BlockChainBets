import { useContext } from "react";
import { BetsContext } from "@/contexts/BetsContext";

export const useBets = () => {
  const context = useContext(BetsContext);
  
  if (!context) {
    throw new Error("useBets must be used within a BetsProvider");
  }
  
  return context;
};
