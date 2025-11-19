import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "@/lib/type";

export interface CartItem {
  id?: string;
  courseId: string;
  course: Course;
  addedAt?: string;
  status?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    loadCartFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    addToCartOptimistic(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    addToCartSuccess(state, action: PayloadAction<string>) {},
    addToCartFailure(
      state,
      action: PayloadAction<{ courseId: string; error: string }>
    ) {
      state.items = state.items.filter(
        (i) => i.course.id !== action.payload.courseId
      );
      state.error = action.payload.error;
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  loadCartStart,
  loadCartSuccess,
  loadCartFailure,
  addToCartOptimistic,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
