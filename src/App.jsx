import { useEffect } from "react";
import { AppProvider } from "./context/AppProvider";
import MainApp from "./MainApp";
import { ServiceCardProvider } from "./components/ServicesCards/hooks/ServiceCardContext";

export default function App() {

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppProvider>
      <ServiceCardProvider>

      <MainApp/>
      </ServiceCardProvider>
    </AppProvider>
  );
}
