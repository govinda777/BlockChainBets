import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./contexts/WalletContext";
import { BetsProvider } from "./contexts/BetsContext";
import { EventsProvider } from "./contexts/EventsContext";

createRoot(document.getElementById("root")!).render(
  <WalletProvider>
    <EventsProvider>
      <BetsProvider>
        <App />
      </BetsProvider>
    </EventsProvider>
  </WalletProvider>
);
