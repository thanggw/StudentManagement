import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useCart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const totalItems = items.length;

  return { items, loading, totalItems };
};
