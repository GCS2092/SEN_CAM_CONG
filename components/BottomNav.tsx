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
    { href: "/", label: "Accueil", icon: HomeIcon },
    { href: "/events", label: "Événements", icon: CalendarIcon },
    { href: "/performances", label: "Musique", icon: MicrophoneIcon },
    { href: "/gallery", label: "Galerie", icon: PhotoIcon },
    { href: "/about", label: "À propos", icon: InformationCircleIcon },
  ];

  const adminNavItems: NavItem[] = [
    { href: "/", label: "Accueil", icon: HomeIcon },
    { href: "/admin", label: "Admin", icon: CogIcon },
    { href: "/admin/events", label: "Événements", icon: CalendarIcon },
    {
      href: "/admin/performances",
      label: "Performances",
      icon: MicrophoneIcon,
    },
    { href: "/admin/settings", label: "Paramètres", icon: CogIcon },
  ];

  const artistNavItems: NavItem[] = [
    { href: "/", label: "Accueil", icon: HomeIcon },
    { href: "/artist/dashboard", label: "Dashboard", icon: ChartBarIcon },
    { href: "/artist/performances/new", label: "Créer", icon: PlusCircleIcon },
    { href: "/artist/member", label: "Profil", icon: UserCircleIcon },
    { href: "/gallery", label: "Galerie", icon: PhotoIcon },
  ];

  const userNavItems: NavItem[] = [
    { href: "/", label: "Accueil", icon: HomeIcon },
    { href: "/events", label: "Événements", icon: CalendarIcon },
    { href: "/user/dashboard", label: "Mon compte", icon: UserCircleIcon },
    { href: "/gallery", label: "Galerie", icon: PhotoIcon },
    { href: "/members", label: "Membres", icon: UsersIcon },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-dark border-t border-white/10 shadow-lg">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl mb-1 border transition-colors ${
                    active ? "bg-accent/20 border-accent/50" : "bg-white/5 border-white/10"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-accent" : "text-slate-400"}`} />
                </div>

                <span className={`text-[11px] font-medium tracking-wide ${active ? "text-accent" : "text-slate-400"}`}>
                  {item.label}
                </span>
                {active && <span className="absolute bottom-1 w-6 h-[2px] bg-accent rounded-full" />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
