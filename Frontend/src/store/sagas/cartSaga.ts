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
import { apiRequest } from "@/lib/api";

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

    const data = yield call(apiRequest, `/cart-items/student/${user.id}`, {
      method: "GET",
    });

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

    yield call(apiRequest, `/cart-items/add`, {
      method: "POST",
      body: JSON.stringify({
        studentId: user.id,
        courseId: course.id,
      }),
    });

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

  // Optimistic remove
  yield put(removeFromCart(cartItemId));

  try {
    // Sử dụng apiRequest
    yield call(apiRequest, `/cart-items/${cartItemId}`, {
      method: "DELETE",
    });
  } catch (err) {
    yield put({ type: "cart/loadRequest" });
  }
}

export default function* cartSaga(): Generator<any, void, any> {
  yield takeLatest("cart/loadRequest", loadCartSaga);
  yield takeEvery("cart/addRequest", addToCartSaga);
  yield takeEvery("cart/removeRequest", removeFromCartSaga);
}
