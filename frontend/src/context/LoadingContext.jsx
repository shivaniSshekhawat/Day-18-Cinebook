import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [isManual, setIsManual] = useState(false);

  const showLoader = (text = "Loading...", manual = false) => {
    setLoadingText(text);
    setLoading(true);
    if (manual) setIsManual(true);
  };

  const hideLoader = (force = false) => {
    if (isManual && !force) return;
    setLoading(false);
    setIsManual(false);
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingText, isManual, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
