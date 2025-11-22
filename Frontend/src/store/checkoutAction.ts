"use server";

import { apiRequestServer } from "@/lib/api-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function checkoutAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/dashboard/students");
  }

  try {
    const result = await apiRequestServer<{
      message: string;
      orderId: string;
      totalAmount: number;
      remainingBalance: number;
    }>("/checkout", token, {
      method: "POST",
      body: JSON.stringify({
        studentId: formData.get("studentId"),
      }),
    });

    revalidatePath("/dashboard/cart");

    redirect(
      `/dashboard/cart/success?orderId=${result.orderId}&amount=${result.totalAmount}`
    );
  } catch (error) {
    redirect("/dashboard/students");
  }
}
