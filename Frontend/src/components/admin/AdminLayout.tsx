"use client";
import { useRouter } from "next/navigation";
import { BookOpenCheck, UserCog, Users, Search } from "lucide-react";

const ADMIN_MENU = [
  { id: "students", icon: Users, label: "Quản lý SV", path: "/" },
  { id: "manage-users", icon: UserCog, label: "Quản lý user", path: "/user" },
  {
    id: "manage-courses",
    icon: BookOpenCheck,
    label: "Quản lý course",
    path: "/course",
  },
];

export default function AdminLayout({
  children,
  title,
  activeId,
}: {
  children: React.ReactNode;
  title: string;
  activeId: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-red-500 to-rose-600 text-white">
          <h2 className="text-xl font-bold">Quản trị viên</h2>
          <p className="text-sm opacity-90">Hệ thống quản lý</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <p className="text-xs font-bold text-purple-900">v2.0</p>
            <p className="text-xs text-purple-700">© 2025 EduSys</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
