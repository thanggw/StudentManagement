import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Roles } from "@/lib/constants";

export const useIsAdmin = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user?.roles?.includes(Roles.ADMIN) ?? false;
};

export const useIsStudent = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user?.roles?.includes(Roles.USER) ?? false;
};

export const useCurrentUser = () => {
  return useSelector((state: RootState) => state.auth.user);
};
