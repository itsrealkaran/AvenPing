import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

interface UserInfo {
  userInfo: {
    id: string;
    name: string;
    email: string;
    plans: {
      id: string;
      name: string;
      price: number;
      period: string;
      region: string;
    }[];
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
  refreshUser: () => Promise<void>;
  hasWhatsAppAccount: boolean;
  isLoading: boolean;
}

export const UserContext = createContext<UserInfo>({
  userInfo: {
    id: "",
    name: "",
    email: "",
    whatsappAccount: null,
    plans: [],
  },
  setUserInfo: () => {},
  setActivePhoneNumber: () => {},
  refreshUser: async () => {},
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
        const phoneNumbers =
          response.data.userData.whatsappAccount.phoneNumbers || [];

        // Check sessionStorage for saved phone number choice
        const savedPhoneNumber = sessionStorage.getItem("selectedPhoneNumber");
        let activePhoneNumber = null;

        if (savedPhoneNumber && phoneNumbers.length > 0) {
          // Try to find the saved phone number in the available phone numbers
          activePhoneNumber = phoneNumbers.find(
            (phone: any) => phone.phoneNumber === savedPhoneNumber
          );
        }

        // Fallback to first phone number if saved choice not found or no saved choice
        if (!activePhoneNumber && phoneNumbers.length > 0) {
          activePhoneNumber = phoneNumbers[0];
        }

        setUserInfo({
          id: response.data.userData.id,
          name: response.data.userData.name,
          email: response.data.userData.email,
          plans: response.data.userData.plans,
          whatsappAccount: {
            id: response.data.userData.whatsappAccount.id,
            name: response.data.userData.whatsappAccount.name,
            email: response.data.userData.whatsappAccount.email,
            phoneNumbers: phoneNumbers,
            activePhoneNumber: activePhoneNumber,
          },
        });
      } else {
        // Clear saved phone number if no WhatsApp account
        sessionStorage.removeItem("selectedPhoneNumber");
        setUserInfo({
          plans: [],
          whatsappAccount: null,
        });
      }
    } catch (error) {
      // Clear saved phone number on error
      sessionStorage.removeItem("selectedPhoneNumber");
      setUserInfo({
        plans: [],
        whatsappAccount: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const setActivePhoneNumber = useCallback(
    (phoneNumber: string) => {
      if (!userInfo?.whatsappAccount?.phoneNumbers) return;

      const phoneNumbers = userInfo.whatsappAccount.phoneNumbers.find(
        (phone: any) => phone.phoneNumber === phoneNumber
      );
      if (phoneNumbers) {
        console.log("UserContext: Setting active phone number:", phoneNumbers);

        // Save the selected phone number to sessionStorage
        sessionStorage.setItem("selectedPhoneNumber", phoneNumber);

        setUserInfo({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          plans: userInfo.plans,
          whatsappAccount: {
            ...userInfo.whatsappAccount,
            activePhoneNumber: phoneNumbers,
          },
        });
      }
    },
    [userInfo]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Debug logging for user info updates
  useEffect(() => {
    console.log("UserContext: User info updated:", userInfo);
  }, [userInfo]);

  const hasWhatsAppAccount =
    userInfo?.whatsappAccount?.id &&
    userInfo.whatsappAccount.phoneNumbers &&
    userInfo.whatsappAccount.phoneNumbers.length > 0;

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        setActivePhoneNumber,
        refreshUser,
        hasWhatsAppAccount,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
