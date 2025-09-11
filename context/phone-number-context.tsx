"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "./user-context";

interface PhoneNumberContextType {
  handlePhoneNumberChange: (phoneNumber: string) => void;
  refreshAllData: () => void;
}

const PhoneNumberContext = createContext<PhoneNumberContextType | undefined>(
  undefined
);

export function PhoneNumberProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { setActivePhoneNumber } = useUser();

  const handlePhoneNumberChange = useCallback(
    (phoneNumber: string) => {
      console.log(
        "PhoneNumberContext: Handling phone number change to:",
        phoneNumber
      );

      // Update the active phone number in user context
      setActivePhoneNumber(phoneNumber);

      // The individual providers will handle their own data invalidation
      // through their useEffect hooks that watch for user changes
    },
    [setActivePhoneNumber]
  );

  const refreshAllData = useCallback(() => {
    console.log("PhoneNumberContext: Refreshing all data");

    // Invalidate all queries that depend on phone number or account
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
    queryClient.invalidateQueries({ queryKey: ["templates"] });
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["labels"] });
    queryClient.invalidateQueries({ queryKey: ["conversation"] });
    queryClient.invalidateQueries({ queryKey: ["obaStatus"] });
    queryClient.invalidateQueries({ queryKey: ["userSettings"] });
  }, [queryClient]);

  const value: PhoneNumberContextType = {
    handlePhoneNumberChange,
    refreshAllData,
  };

  return (
    <PhoneNumberContext.Provider value={value}>
      {children}
    </PhoneNumberContext.Provider>
  );
}

export function usePhoneNumber() {
  const context = useContext(PhoneNumberContext);
  if (context === undefined) {
    throw new Error("usePhoneNumber must be used within a PhoneNumberProvider");
  }
  return context;
}

