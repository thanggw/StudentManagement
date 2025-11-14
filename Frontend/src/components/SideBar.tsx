"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "students", icon: Users, label: "Quản lý SV" },
  { id: "courses", icon: BookOpen, label: "Môn học" },
  { id: "grades", icon: FileText, label: "Điểm số" },
  { id: "schedule", icon: Calendar, label: "Lịch học" },
  { id: "reports", icon: BarChart3, label: "Báo cáo" },
  { id: "settings", icon: Settings, label: "Cài đặt" },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>("dashboard");

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`group relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
          <p className="text-sm font-bold text-blue-900">Cần hỗ trợ ngay?</p>
          <p className="text-xs text-blue-700 mt-1">IT Support luôn sẵn sàng</p>
          <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 transition-all hover:translate-x-1 inline-flex items-center gap-1">
            Gửi yêu cầu <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
