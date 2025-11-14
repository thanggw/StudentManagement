"use client";

import { Layout } from "antd";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
