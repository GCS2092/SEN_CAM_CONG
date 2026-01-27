"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  CalendarIcon,
  MicrophoneIcon,
  PhotoIcon,
  InformationCircleIcon,
  CogIcon,
  ChartBarIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UsersIcon,
} from "@/components/Icons";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { isAuthenticated, getUserRole } =
          await import("@/lib/auth-persistence");
        if (isAuthenticated()) {
          setIsAuthenticated(true);
          setUserRole(getUserRole());
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  // Navigation items for different user roles
  const publicNavItems: NavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: HomeIcon,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      href: "/events",
      label: "Événements",
      icon: CalendarIcon,
      color: "bg-gradient-to-br from-green-500 via-yellow-400 to-red-500",
      badge: "New",
    },
    {
      href: "/performances",
      label: "Musique",
      icon: MicrophoneIcon,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      href: "/gallery",
      label: "Galerie",
      icon: PhotoIcon,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      href: "/about",
      label: "À propos",
      icon: InformationCircleIcon,
      color: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: HomeIcon,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: CogIcon,
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      href: "/admin/events",
      label: "Événements",
      icon: CalendarIcon,
      color: "bg-gradient-to-br from-green-500 via-yellow-400 to-red-500",
    },
    {
      href: "/admin/performances",
      label: "Performances",
      icon: MicrophoneIcon,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      href: "/admin/settings",
      label: "Paramètres",
      icon: CogIcon,
      color: "bg-gradient-to-br from-gray-600 to-gray-700",
    },
  ];

  const artistNavItems: NavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: HomeIcon,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      href: "/artist/dashboard",
      label: "Dashboard",
      icon: ChartBarIcon,
      color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    },
    {
      href: "/artist/performances/new",
      label: "Créer",
      icon: PlusCircleIcon,
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    {
      href: "/artist/member",
      label: "Profil",
      icon: UserCircleIcon,
      color: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
    {
      href: "/gallery",
      label: "Galerie",
      icon: PhotoIcon,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
  ];

  const userNavItems: NavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: HomeIcon,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      href: "/events",
      label: "Événements",
      icon: CalendarIcon,
      color: "bg-gradient-to-br from-green-500 via-yellow-400 to-red-500",
    },
    {
      href: "/user/dashboard",
      label: "Mon compte",
      icon: UserCircleIcon,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      href: "/gallery",
      label: "Galerie",
      icon: PhotoIcon,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      href: "/members",
      label: "Membres",
      icon: UsersIcon,
      color: "bg-gradient-to-br from-teal-500 to-cyan-500",
    },
  ];

  // Determine which navigation to use
  let navItems = publicNavItems;
  if (isAuthenticated && userRole === "ADMIN") {
    navItems = adminNavItems;
  } else if (isAuthenticated && userRole === "ARTIST") {
    navItems = artistNavItems;
  } else if (isAuthenticated && userRole === "USER") {
    navItems = userNavItems;
  }

  // Don't show on login page
  if (pathname === "/login") {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {/* Icon container with color */}
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1 transition-all ${
                    active
                      ? `${item.color} shadow-lg`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      active ? "text-white drop-shadow-lg" : "text-gray-600"
                    }`}
                  />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-semibold ${
                    active ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
