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
        isRegistered: boolean;
        codeVerificationStatus: string;
      }[];
      activePhoneNumber: {
        id: string;
        name: string;
        phoneNumber: string;
        phoneNumberId: string;
        isRegistered: boolean;
        codeVerificationStatus: string;
      } | null;
    } | null;
  };
  setUserInfo: (userInfo: UserInfo) => void;
  setActivePhoneNumber: (phoneNumber: string) => void;
  hasWhatsAppAccount: boolean;
  isLoading: boolean;
}

export const UserContext = createContext<UserInfo>({
  userInfo: {
    whatsappAccount: null,
  },
  setUserInfo: () => {},
  setActivePhoneNumber: () => {},
  hasWhatsAppAccount: false,
  isLoading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get-info");
      
      if (response.data.userData.whatsappAccount) {
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
      } else {
        setUserInfo({
          whatsappAccount: null,
        });
      }
    } catch (error) {
      setUserInfo({
        whatsappAccount: null,
      });
    } finally {
      setIsLoading(false);
    }
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

  const hasWhatsAppAccount = userInfo?.whatsappAccount?.id && 
                            userInfo.whatsappAccount.phoneNumbers && 
                            userInfo.whatsappAccount.phoneNumbers.length > 0;

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, setActivePhoneNumber, hasWhatsAppAccount, isLoading }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};