import { useContext } from "react";
import { UserContext } from "@/context/user-context";

const useGetUser = () => {
  const { userInfo } = useContext(UserContext);

  return userInfo;
};

export default useGetUser;