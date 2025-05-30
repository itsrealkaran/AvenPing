import { useContext } from "react";
import { UserContext } from "@/context/user-context";

const useGetUser = () => {
  const { userInfo } = useContext(UserContext);
  console.log(userInfo);
  
  return userInfo;
};

export default useGetUser;