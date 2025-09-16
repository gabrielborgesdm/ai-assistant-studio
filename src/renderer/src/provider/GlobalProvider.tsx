/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Config } from "@global/types/config";

interface GlobalContextType {
  isNavigationDisabled: boolean;
  setIsNavigationDisabled: (disabled: boolean) => void;
  config: Config | undefined;
  setConfig: (config: Config | undefined) => void;
  os: string | undefined;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(false);
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [os, setOs] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadConfig = async (): Promise<void> => {
      const config = await window.api.config.getConfig();
      setConfig(config);
    };
    loadConfig();

    const loadOs = async (): Promise<void> => {
      const os = await window.api.config.getOs();
      console.log("os", os);
      setOs(os);
    };
    loadOs();
  }, []);

  const contextValue = useMemo(() => {
    return {
      isNavigationDisabled,
      setIsNavigationDisabled,
      config,
      setConfig,
      os,
    };
  }, [isNavigationDisabled, config, os]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
