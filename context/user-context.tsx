import axios from "axios";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

interface UserInfo {
  userInfo: {
    whatsappAccount: {
      id: string;
      phoneNumbers: {
        id: string;
        phoneNumber: string;
        phoneNumberId: string;
      }[];
      activePhoneNumber: {
        id: string;
        phoneNumber: string;
        phoneNumberId: string;
      } | null;
    };
  };
  setUserInfo: (userInfo: UserInfo) => void;
}

export const UserContext = createContext<UserInfo>({
  userInfo: {
    whatsappAccount: {
      id: "",
      phoneNumbers: [],
      activePhoneNumber: null,
    },
  },
  setUserInfo: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const fetchUser = useCallback(async () => {
    const response = await axios.get("/api/get-info");
    
    setUserInfo({
      whatsappAccount: {
        id: response.data.userData.whatsappAccount.id,
        phoneNumbers: response.data.userData.whatsappAccount.phoneNumbers,
        activePhoneNumber: response.data.userData.whatsappAccount.phoneNumbers[0] || null,
      },
    });
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};