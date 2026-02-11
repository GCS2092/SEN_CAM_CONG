"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClockIcon,
  MusicalNoteIcon,
  HomeIcon,
  PhotoIcon,
  MicrophoneIcon,
  InformationCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  venue?: string | null;
  ticketPrice: number | null;
}

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const navItems = [
    { name: "Accueil", href: "/", icon: HomeIcon },
    { name: "Événements", href: "/events", icon: CalendarIcon },
    { name: "Performances", href: "/performances", icon: MicrophoneIcon },
    { name: "Galerie", href: "/gallery", icon: PhotoIcon },
    { name: "À propos", href: "/about", icon: InformationCircleIcon },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadNextEvent() {
      try {
        const res = await fetch("/api/events?status=UPCOMING&limit=1");
        if (res.ok) {
          const data = await res.json();
          if (data.events?.length > 0) {
            const sorted = data.events.sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setNextEvent(sorted[0]);
          }
        }
      } catch {
        setNextEvent(null);
      }
    }
    loadNextEvent();
  }, []);

  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const diffDays = Math.ceil(
      (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      countdown: diffDays > 0 ? `Dans ${diffDays}j` : "Bientôt",
    };
  };

  const handleLogout = () => {
    import("@/lib/auth-persistence").then(({ clearAuth }) => {
      clearAuth();
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 lg:h-16 gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-accent rounded-full flex items-center justify-center">
              <MusicalNoteIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base lg:text-lg font-bold text-gray-900">
                SEN CAM CONG
              </span>
              <p className="text-[10px] lg:text-xs text-gray-500 -mt-0.5 hidden lg:block">
                Fusion Musicale
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? "text-accent bg-blue-50" : "text-gray-600 hover:text-accent hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {nextEvent && (
            <Link
              href={`/events/${nextEvent.id}`}
              className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors overflow-hidden"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Prochain
                </div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                  {nextEvent.title}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                  {formatEventDateTime(nextEvent.date).date}
                  {" · "}
                  {formatEventDateTime(nextEvent.date).time}
                  {formatEventDateTime(nextEvent.date).countdown !== "Bientôt" &&
                    ` · ${formatEventDateTime(nextEvent.date).countdown}`}
                  {nextEvent.ticketPrice != null &&
                    nextEvent.ticketPrice > 0 &&
                    ` · ${nextEvent.ticketPrice.toLocaleString()} FCFA`}
                </div>
              </div>
              <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent shrink-0" />
            </Link>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 border border-gray-200">
              <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent shrink-0" />
              <span className="font-mono font-semibold text-gray-800 text-xs sm:text-sm">
                {currentTime}
              </span>
            </div>

            {!authLoading && (
              isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-medium text-gray-600 hover:text-accent border border-gray-200 hover:border-accent/50 rounded-lg px-2 sm:px-3 py-1.5 transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-accent hover:text-accent-light border border-accent/50 hover:border-accent rounded-lg px-2 sm:px-3 py-1.5 transition-colors"
                >
                  Connexion
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
