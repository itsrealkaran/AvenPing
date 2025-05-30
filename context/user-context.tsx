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
    };
  };
  setUserInfo: (userInfo: UserInfo) => void;
}

export const UserContext = createContext<UserInfo>({
  userInfo: {
    whatsappAccount: {
      id: "",
      phoneNumbers: [],
    },
  },
  setUserInfo: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const fetchUser = useCallback(async () => {
    const response = await axios.get("/api/get-info");
    setUserInfo(response.data.userData);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>
  );
};