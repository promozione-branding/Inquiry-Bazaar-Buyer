"use client";
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  LayoutDashboard,
  User,
  Settings,
  Menu,
  X,
  CircleQuestionMark,
  Phone,
  Mail,
} from "lucide-react";

export default function BuyerSidebar() {





  const { user } = useSelector((state) => state.auth);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };




  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      name: "Help",
      icon: CircleQuestionMark,
      path: "/help",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-5 left-50 z-9999 bg-[#183B63] text-white p-3 rounded-xl shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-20 left-0
          h-screen
          w-[280px]
          bg-white
          border-r
          border-gray-200
          shadow-lg
          z-50
          transition-transform
          duration-300
          overflow-y-auto

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}
       <div className="p-5 border-b relative">
  <button
    onClick={() => setOpen(false)}
    className="md:hidden absolute right-4 top-4"
  >
    <X size={22} />
  </button>

  <div className="flex flex-col items-center text-center">
    {user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={user?.name}
        className="w-20 h-20 rounded-full object-cover border-4 border-[#183B63]/10"
      />
    ) : (
      <div className="w-20 h-20 rounded-full bg-[#183B63] text-white flex items-center justify-center text-3xl font-bold">
        {getInitial(user?.name)}
      </div>
    )}

    <h3 className="mt-3 font-semibold text-lg text-[#183B63]">
      {user?.name || "Buyer"}
    </h3>

    

    <div className="w-full mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={14} />
        <span>{user?.phone || "-"}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 break-all">
        <Mail size={14} />
        <span>{user?.email || "-"}</span>
      </div>
    </div>

  
  </div>
</div>
        {/* Seller CTA */}
        <div className="p-4">
          <a
            href="https://seller.inquirybazaar.com/register"
            target="_blank"
            className="
              block
              bg-gradient-to-r
              from-orange-500
              to-orange-600
              text-white
              text-center
              py-3
              rounded-xl
              font-medium
              hover:shadow-lg
              transition
            "
          >
            Become a Seller →
          </a>
        </div>

        {/* Menu */}
        <nav className="px-3 pb-6">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  mb-2
                  transition-all

                  ${
                    active
                      ? "bg-[#183B63] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}