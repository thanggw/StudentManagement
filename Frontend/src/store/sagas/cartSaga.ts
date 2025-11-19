import { call, put, takeEvery, select, takeLatest } from "redux-saga/effects";
import {
  loadCartSuccess,
  loadCartFailure,
  addToCartOptimistic,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
} from "../cartSlice";
import { RootState } from "..";
interface AddToCartAction {
  type: string;
  payload: { course: any };
}
interface RemoveFromCartAction {
  type: string;
  payload: string;
}
function* loadCartSaga(): Generator<any, void, any> {
  try {
    const user = yield select((state: RootState) => state.auth.user);
    if (!user) return;

    const res = yield call(
      fetch,
      `${process.env.NEXT_PUBLIC_API_URL}/cart-items/student/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );

    if (!res.ok) {
      const error = yield res.json();
      throw new Error(error.error?.message || "Không thể tải giỏ hàng");
    }

    const data = yield res.json();
    yield put(loadCartSuccess(data.items || []));
  } catch (err: any) {
    yield put(loadCartFailure(err.message || "Lỗi tải giỏ hàng"));
  }
}

function* addToCartSaga(action: AddToCartAction): Generator<any, void, any> {
  const { course } = action.payload;

  yield put(
    addToCartOptimistic({
      courseId: course.id,
      course,
      addedAt: new Date().toISOString(),
    })
  );

  try {
    const user = yield select((state: RootState) => state.auth.user);
    if (!user) throw new Error("Không tìm thấy người dùng");

    const res = yield call(
      fetch,
      `${process.env.NEXT_PUBLIC_API_URL}/cart-items/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          studentId: user.id,
          courseId: course.id,
        }),
      }
    );

    if (!res.ok) {
      const error = yield res.json();
      throw new Error(error.error?.message || "Thêm vào giỏ thất bại");
    }

    yield put(addToCartSuccess(course.id));
  } catch (err: any) {
    yield put(
      addToCartFailure({
        courseId: course.id,
        error: err.message,
      })
    );
  }
}

function* removeFromCartSaga(
  action: RemoveFromCartAction
): Generator<any, void, any> {
  const cartItemId = action.payload;
  yield put(removeFromCart(cartItemId));

  try {
    yield call(
      fetch,
      `${process.env.NEXT_PUBLIC_API_URL}/cart-items/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
  } catch (err) {
    // Nếu xóa lỗi → reload giỏ hàng
    yield put({ type: "cart/loadRequest" });
  }
}

// Export với takeEvery/takeLatest
export default function* cartSaga(): Generator<any, void, any> {
  yield takeLatest("cart/loadRequest", loadCartSaga);
  yield takeEvery("cart/addRequest", addToCartSaga);
  yield takeEvery("cart/removeRequest", removeFromCartSaga);
}
