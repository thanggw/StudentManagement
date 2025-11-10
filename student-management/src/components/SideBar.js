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

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
  { id: "students", icon: Users, label: "Quản lý SV", active: false },
  { id: "courses", icon: BookOpen, label: "Môn học", active: false },
  { id: "grades", icon: FileText, label: "Điểm số", active: false },
  { id: "schedule", icon: Calendar, label: "Lịch học", active: false },
  { id: "reports", icon: BarChart3, label: "Báo cáo", active: false },
  { id: "settings", icon: Settings, label: "Cài đặt", active: false },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Cần hỗ trợ?</p>
          <p className="text-xs text-blue-700 mt-1">Liên hệ IT Support</p>
          <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
            Gửi yêu cầu →
          </button>
        </div>
      </div>
    </aside>
  );
}
