"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { message } from "antd";
import { Roles } from "@/lib/constants";

export const useAuth = (requireAdmin = false) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const isAdmin = user?.roles?.includes(Roles.ADMIN) || false;

  useEffect(() => {
    if (requireAdmin && !isAdmin) {
      message.warning("Access denied. Redirecting...");
      router.push("/dashboard/students");
    } else if (!user) {
      router.push("/auth/login");
    }
  }, [user, isAdmin, router, requireAdmin]);

  return { user, isAdmin };
};
