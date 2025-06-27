import axios from "axios";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

interface UserInfo {
  userInfo: {
    whatsappAccount: {
      id: string;
      name: string;
      email: string;
      phoneNumbers: {
        id: string;
        name: string;
        phoneNumber: string;
        phoneNumberId: string;
      }[];
      activePhoneNumber: {
        id: string;
        name: string;
        phoneNumber: string;
        phoneNumberId: string;
      } | null;
    };
  };
  setUserInfo: (userInfo: UserInfo) => void;
  setActivePhoneNumber: (phoneNumber: string) => void;
}

export const UserContext = createContext<UserInfo>({
  userInfo: {
    whatsappAccount: {
      id: "",
      name: "",
      email: "",
      phoneNumbers: [],
      activePhoneNumber: null,
    },
  },
  setUserInfo: () => {},
  setActivePhoneNumber: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const fetchUser = useCallback(async () => {
    const response = await axios.get("/api/get-info");
    
    const phoneNumbers = response.data.userData.whatsappAccount.phoneNumbers || [];
    const activePhoneNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : null;

    setUserInfo({
      whatsappAccount: {
        id: response.data.userData.whatsappAccount.id,
        name: response.data.userData.whatsappAccount.name,
        email: response.data.userData.whatsappAccount.email,
        phoneNumbers: phoneNumbers,
        activePhoneNumber: activePhoneNumber,
      },
    });
  }, []);

  const setActivePhoneNumber = useCallback((phoneNumber: string) => {
    if (!userInfo?.whatsappAccount?.phoneNumbers) return;
    
    const phoneNumbers = userInfo.whatsappAccount.phoneNumbers.find((phone: any) => phone.phoneNumber === phoneNumber);
    if (phoneNumbers) {
      setUserInfo({
        whatsappAccount: {
          ...userInfo.whatsappAccount,
          activePhoneNumber: phoneNumbers,
        },
      });
    }
  }, [userInfo]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, setActivePhoneNumber }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};